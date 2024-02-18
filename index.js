const express = require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const routes = require('./routes')
const initialize = require("./other/passport-config")
const passport = require("passport")
initialize(passport)
const flash = require("express-flash")
const session = require("express-session")
const JWT_SUPA_SEKRET = require("./config.json").JWT_SUPA_SEKRET
const UserModel = require("./models/user")
let users = [];
const fetch = require("node-fetch")
const fs = require("fs")

app.use(flash())
app.use(session({
  secret:JWT_SUPA_SEKRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use('/', routes)

server.listen(3000)

io.on('connection', async socket => {
  socket.on("userOnline",async(data) => {
    socket.username = data.id
    if(users.some(d => d.username === socket.username)){
      users.filter(d => d.username == socket.username)[0].userID = socket.id
      return
    }
    users.push({userID: socket.id,username: socket.username});
    const user = await UserModel.findById({_id:data.id})
  })
  socket.on('send-chat-message', async (user, id, name, message, file, filename, type) => {
    if(user === "62adb2eaddfd4a061dc8bc40")notifier.notify({message:`${name} Just sent you a message`,id:id,title:"Chats"});
    
    const info = users.filter(u => u.username == user)[0]
    if(file == null && filename == null){
      if(!info)return await fetch("http://192.168.1.132:3000/api/sendchat",{method:'post',body:JSON.stringify({message:message,to:user,from:id,fileURL:null}),headers:{'Content-Type': 'application/json'}})
      //console.log(socket.to(info.userID))
      socket.to(info.userID).emit('chat-message', { message: message, name: name, to: id ,fileURL:null,type:null})
      await fetch("http://192.168.1.132:3000/api/sendchat",{method:'post',body:JSON.stringify({message:message,to:user,from:id,fileURL:null}),headers:{'Content-Type': 'application/json'}})
    }
    else{
      fs.writeFile(`./public/img/${filename}`, file, async (err) => {
      if(err)throw err
      let t = null
      if(type.startsWith("video")){
        t = "video"
      }
      if(type.startsWith("image")){
        t = "image"
      }
      if(type.startsWith("audio")){
        t = "audio"
      }
      if(!info)return await fetch("http://192.168.1.132:3000/api/sendchat",{method:'post',body:JSON.stringify({message:message,to:user,from:id,fileURL:`/img/${filename}`,type:t}),headers:{'Content-Type': 'application/json'}})
      //console.log(socket.to(info.userID))
      socket.to(info.userID).emit('chat-message', { message: message, name: name, to: id ,fileURL:`/img/${filename}`,type:t})
      await fetch("http://192.168.1.132:3000/api/sendchat",{method:'post',body:JSON.stringify({message:message,to:user,from:id,fileURL:`/img/${filename}`,type:t}),headers:{'Content-Type': 'application/json'}})
      })
    }
  })
  socket.on('send-group-message', async (groupname, group, id, name, message, file, filename, type) => {
    try{
      if(file == null && filename == null){
        socket.join(groupname)
        socket.to(groupname).emit('group-message', { message: message, name: name, group: group ,fileURL:null,type:null})
        await fetch("http://192.168.1.132:3000/api/sendgroup",{method:'post',body:JSON.stringify({message:message,group:group,from:id,fileURL:null}),headers:{'Content-Type': 'application/json'}})
      }
      else{
        fs.writeFile(`./public/img/${filename}`, file, async (err) => {
        if(err)throw err
        let t = null
        if(type.startsWith("video")){
          t = "video"
        }
        if(type.startsWith("image")){
          t = "image"
        }
        if(type.startsWith("audio")){
          t = "audio"
        }
        socket.join(groupname)
        socket.to(groupname).emit('group-message', { message: message, name: name, group: id ,fileURL:`/img/${filename}`,type:t})
        await fetch("http://192.168.1.132:3000/api/sendgroup",{method:'post',body:JSON.stringify({message:message,group:group,from:id,fileURL:`/img/${filename}`,type:t}),headers:{'Content-Type': 'application/json'}})
        })
      }
    }catch(e){
      console.log(e)
    }
  })
})