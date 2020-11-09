var returnMessage=(username,text)=>{
  return {username,text,createdAt:new Date().getTime()};
};

var returnlocationMessage=(username,url)=>{
  return {username,url,createdAt:new Date().getTime()};
};
module.exports={returnMessage,returnlocationMessage};
