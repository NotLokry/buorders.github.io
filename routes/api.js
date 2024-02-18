const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const mongoose = require('mongoose')
const UserModel = require("../models/user")
const OrderModel = require("../models/uzsakymas")
const passport = require("passport")
const fetch = require("node-fetch")
const mongo = require('mongodb')
const ObjectID = mongo.ObjectId

mongoose.connect(require("../config.json").mongo, {
    useNewUrlParser: true,
    useUnifiedTopology:true
})

app.use(bodyParser.json())
app.post("/order", async (req,res) => {
    let {who,order,courier,metal} = req.body
    try {
        const response = await OrderModel.create({
            kieno:who,
            kam:courier,
            uzsakymas:order,
            atlikta:false,
            grynais:metal,
        })
        console.log("New order created to",courier)
        res.json({status:"ok"})
    } catch (error) {
        console.log(error)
        if(error.code === 11000){
            // Email in use
        }
        throw error
    }
})
app.post("/login", passport.authenticate('local'), (req, res)=>{
    res.json({status:"ok"})
})
app.get('/getOrders',async (req,res)=>{
    if(!req.user)return res.redirect("/")
    const data = await OrderModel.find({"kam":{$in:req.user.name}})

    res.json(data)
})
app.post('/add',async (req,res)=>{
    if(!req.user)return res.redirect("/")
    const data = await UserModel.findOne({name:req.body.name})
    if(data == null)return res.json({error:"Unknown User"})
    if(data.name === req.user.name)return res.json({error:"Can't add yourself"})
    if(req.user.friends.filter(f => f.name === data.name).length > 0)return res.json({error:"Friend already added"})
    await UserModel.findOneAndUpdate({email:data.email},{
        $push:{
            pending:{
                name:req.user.name,
                _id:req.user._id,
                __v:req.user.__v
            }
        }
    })
    res.json({status:"ok"})
    res.status(402)
})
app.post('/accept',async (req,res)=>{
    if(!req.user)return res.redirect("/")
    const data = await UserModel.findOne({name:req.body.name})
    if(data == null)return res.json({error:"Unknown User"})
    if(data.name === req.user.name)return res.json({error:"Can't add yourself"})
    await UserModel.findOneAndUpdate({email:req.user.email},{
        $pull:{
            pending:{
                name:data.name,
                _id:data._id,
                __v:data.__v
            }
        },
        $push:{
            friends:{
                name:data.name,
                _id:data._id,
                __v:data.__v,
                messages:[]
            }
        }
    })
    await UserModel.findOneAndUpdate({_id:data._id},{
        $push:{
            friends:{
                name:req.user.name,
                _id:req.user._id,
                __v:req.user.__v,
                messages:[]
            }
        }
    })
    res.json({status:"ok"})
    res.status(402)
})
app.post('/decline',async (req,res)=>{
    if(!req.user)return res.redirect("/")
    const data = await UserModel.findOne({name:req.body.name})
    await UserModel.findOneAndUpdate({email:req.user.email},{
        $pull:{
            pending:{
                name:data.name,
                email:data.email,
                _id:data._id,
                __v:data.__v
            }
        }
    })
    res.json({status:"ok"})
    res.status(402)
})
app.post("/sendchat",async (req,res)=>{
    const body = req.body
    const from = await UserModel.findById({_id:body.from})
    const to = await UserModel.findById({_id:body.to})
    const id = new ObjectID()
    await UserModel.findOneAndUpdate({_id:from._id,"friends._id":to._id},{
        $push:{
            "friends.$.messages":{
                id: id,
                date: new Date(),
                content: body.message,
                fileURL:body.fileURL,
                type:body.type,
                from:{
                    _id:from._id,
                    name:from.name
                }
            }
        }
    })
    await UserModel.findOneAndUpdate({_id:to._id,"friends._id":from._id},{
        $push:{
            "friends.$.messages":{
                id: id,
                date: new Date(),
                content: body.message,
                fileURL:body.fileURL,
                type:body.type,
                from:{
                    _id:from._id,
                    name:from.name
                }
            }
        }
    })
})


module.exports = app