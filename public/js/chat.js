
const socket= io()

// //elements
const $messages=document.querySelector("#messages");
// //templates
const messageTemplate=document.querySelector("#message-template").innerHTML;
const locationTemplate=document.querySelector("#location-template").innerHTML;
const sidebartemplate=document.querySelector("#sidebartemplate").innerHTML;

//query parameters
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true});
// socket.on("welcomenote",(welcome)=>{
//   console.log(welcome);
//   const html = Mustache.render(messageTemplate,{message:welcome});
//   $messages.insertAdjacentHTML("beforeend",html);
// });


document.querySelector("#message-form").addEventListener("submit",(e)=>{
  e.preventDefault();
  document.querySelector("button").disabled=true;
      socket.emit("sendMessage",document.querySelector("#textdata").value,(error)=>{
    if(error)
    {
      return console.log(error);
    }
        console.log("message delivered");

      });
      document.querySelector("button").disabled=false;
      document.querySelector("#textdata").value="";
      document.querySelector("#textdata").focus();
})

// document.querySelector("#button").addEventListener("click",()=>{
//   // console.log("clicked");
//
//     document.querySelector("#button").disabled=true;
//     socket.emit("sendMessage",document.querySelector("#textdata").value,(error)=>{
//   if(error)
//   {
//     return console.log(error);
//   }
//       console.log("message delivered");
//
//     });
//     document.querySelector("#button").disabled=false;
//     document.querySelector("#textdata").value="";
//     document.querySelector("#textdata").focus();
//
//
// });

socket.on("sendMessage",(sendMessage)=>{
  console.log(sendMessage);
  const html = Mustache.render(messageTemplate,{username:sendMessage.username,message:sendMessage.text,createdAt:moment(sendMessage.createdAt).format('LT')});
  $messages.insertAdjacentHTML("beforeend",html);
  autoscroll();
});

socket.on("locationMessage",(urlmessage)=>{
console.log(urlmessage);
const html = Mustache.render(locationTemplate,{username:urlmessage.username,location:urlmessage.url,createdAt:moment(urlmessage.createdAt).format('LT')});
$messages.insertAdjacentHTML("beforeend",html);
autoscroll();
});

document.querySelector("#locationshare").addEventListener("click",()=>{
  if(!navigator.geolocation)
  {
    return alert("geolocation is not supported by your browser");
  }
  document.querySelector("#locationshare").disabled=true;
  navigator.geolocation.getCurrentPosition((position)=>{
    socket.emit("sendLocation",{latitude:position.coords.latitude,longitude:position.coords.longitude},()=>{
      console.log("location shared successfully");
      document.querySelector("#locationshare").disabled=false;
    });
  });
});

const autoscroll=()=>{
  const $newmessage=$messages.lastElementChild;
  //height
  const newMessageStyles=getComputedStyle($newmessage);
  const newMessageMargin=parseInt(newMessageStyles.marginBottom)
  const newMessageHeight=$newmessage.offsetHeight+newMessageMargin;

  //visibleheight
  const visibleHeight=$messages.offsetHeight

  const containerHeigth=$messages.scrollHeight
  const scrollOffset=$messages.scrollTop+visibleHeight
  if(containerHeigth -newMessageHeight<=scrollOffset)
  {
    $messages.scrollTop=$messages.scrollHeight
  }
};

socket.on("roomData",(userslist)=>{
  console.log(userslist);
  const html=Mustache.render(sidebartemplate,{room:userslist.room,users:userslist.users});
  document.querySelector("#sidebar").innerHTML=html;
});

socket.emit("join",{username,room},(error)=>{
  if(error)
  {
    alert(error);
    location.href="/";
  }
});

// socket.on("countUpdated",(count)=>{
//   console.log(`the count has been updated count:${count}`);
// });
//
// document.querySelector("#button").addEventListener("click",()=>{
//   console.log("clicked");
//   socket.emit("increment");
// });
