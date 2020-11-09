const users=[];


const addUser=({id,username,room})=>{
  username=username.trim().toLowerCase();
  room=room.trim().toLowerCase();
//validation
  if(!username || !room)
  {
    return {
      error:"username and room is required"
    }
  }
  //checking if user is present
  const existingUser=users.find((user)=>{
    return user.username===username && user.room===room
  });

  if(existingUser)
  {
    return{error:"user already exists"};
  }
  //store users
  const user={id,username,room}
  users.push(user);
  return ({user});
};

const removeUser=(id)=>{
  const index=users.findIndex((user)=>user.id===id)
  if(index!==-1)
  {
    return users.splice(index,1)[0];
  }
}


const getUser=(id)=>{
  const user=users.find((user)=>{
    return user.id===id
  });
  if(!user)
  {
    return ({error:"user not found"});
  }
  return ({user});
}

const getUsersByRoom=(room)=>{
  const output=users.filter((user)=>{
    return user.room===room;
  });
  return output;
}

// addUser({id:22,username:"prudhvi",room:"one"});
// addUser({id:12,username:"ram",room:"one"});
// addUser({id:33,username:"prudhvi",room:"two"});
//
// console.log("users:" ,users);
// console.log(getUsersByRoom("one"));
// console.log(getUser(33));


module.exports={addUser,removeUser,getUser,getUsersByRoom};
