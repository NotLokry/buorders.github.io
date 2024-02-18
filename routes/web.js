const express = require("express")
const app = express()
const UserModel = require("../models/user")
const passport = require("passport")

async function getUsers(){
    data = await UserModel.find({})
    return data
}

app.get('/', (req, res) => {
    if(req.user)return res.redirect("/@me")
    res.render('main', {})
})
app.get("/login",(req,res)=>{
    res.render("login",{})
})
app.get("/@me",async (req,res)=>{
    if(!req.user) return res.redirect('/');
    const user = await UserModel.findById({_id:req.user._id})
    res.render("profile",{user:req.user,users:await getUsers()})
})
module.exports = app
//module.exports = group