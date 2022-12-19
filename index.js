var path=require("path");
const express=require("express");

const bodyParser=require("body-parser");
const request=require("request");
const https=require("https");
const credential=require("./credential");
const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",function(req,res){
  res.sendFile(__dirname+"/signup.html");
});
app.post("/",function(req,res){
 const firstname=req.body.fname;
 const lastname=req.body.lname;
 const email=req.body.email;

 const data={
   members:[
     {
       email_address:email,
       status:"subscribed",
       merge_fields:{
         FNAME: firstname,
         LNAME: lastname
       }
     }
   ]
 };
 const jsondata=JSON.stringify(data);
 const url="https://us10.api.mailchimp.com/3.0/lists/c83c6de55f";

 const bc=https.request(url,credential.options,function(response){

   if(response.statusCode===200){
     res.sendFile(__dirname+"/success.html");
   }else{
     res.sendFile(__dirname+"/failure.html");
   }
   response.on("data",function(data){
     console.log(JSON.parse(data));
   })
 })
 bc.write(jsondata);
 bc.end();
});
 app.listen(process.env.PORT || 3000,function(req,res){
   console.log("server is running on 3000");
 });
