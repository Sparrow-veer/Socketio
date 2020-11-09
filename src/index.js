const path = require('path');
const http=require("http");
const express = require("express");
const socketio = require("socket.io");
const Filter=require("bad-words");
const app = express();
const {returnMessage,returnlocationMessage}=require("./util/messages.js");
const {addUser,removeUser,getUser,getUsersByRoom}=require("./util/users.js");

//below line even if we dont use it it will be done by express in background
const server=http.createServer(app);
const io = socketio(server);
const port = process.env.PORT || 3000 ;

const publicDirectorypath= path.join(__dirname,"../public");
console.log(publicDirectorypath);
app.use(express.static(publicDirectorypath));

let count=0;
io.on("connection",(socket)=>{
  // console.log("new websocket connection");
  // socket.emit("countUpdated",count);
  // socket.on("increment",()=>{
  //   count++;
  // //this line emits to only one connection but io.emit emits to all connections  //socket.emit("countUpdated",count);
  //   io.emit("countUpdated",count);
  // })


socket.on("join",({username,room},callback)=>{
  const {error,user}=addUser({id:socket.id,username,room});
  if(error)
  {
    return callback(error);
  }
  socket.join(user.room)
  socket.emit("sendMessage",returnMessage("Admin","Welcome"));
  socket.broadcast.to(room).emit("sendMessage",returnMessage("Admin",`${user.username} has joined`));
  io.to(user.room).emit("roomData",{room:user.room,users:getUsersByRoom(user.room)});
  callback();
});


socket.on("sendMessage",(sendMessage,callback)=>{
  const {user}=getUser(socket.id);

  const filter=new Filter();
if(filter.isProfane(sendMessage))
{
  return callback("Profanity is not allowed");
}
  io.to(user.room).emit("sendMessage",returnMessage(user.username,sendMessage));
  callback();
});

socket.on("disconnect",()=>{
  const user=removeUser(socket.id);
  if(user)
  {
    io.to(user.room).emit("sendMessage",returnMessage("Admin",`${user.username} is disconnected`));
    io.to(user.room).emit("roomData",{room:user.room,users:getUsersByRoom(user.room)});
  }

});

socket.on("sendLocation",(position,callback)=>{
const {user}=getUser(socket.id);
  io.to(user.room).emit("locationMessage",returnlocationMessage(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`));
  callback();
});

});

server.listen(port,()=>{
  console.log("server up and running at ",port);
});
