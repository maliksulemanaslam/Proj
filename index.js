const { x, booked, myFunction, getVal } = require('./public/javascript/scripting');

//jshint esversion:6
const express               =  require('express'),
      app                   =  express(),
      mongoose              =  require("mongoose"),
      passport              =  require("passport"),
      bodyParser            =  require("body-parser"),
      LocalStrategy         =  require("passport-local"),
      passportLocalMongoose =  require("passport-local-mongoose"),
      User                  =  require("./models/user");
      complaint             =  require("./models/complaint");
      script                =  require("./public/javascript/scripting");

//Connecting database
mongoose.connect("mongodb+srv://suleman:fbxlilt247@cluster0.nz5ar.mongodb.net/adminDB?retryWrites=true&w=majority");

let name, email, msg, loggedinUser, book;
app.use(require("express-session")({
    secret:"Any normal Word",       //decode or encode session
    resave: false,
    saveUninitialized:false
}));

passport.serializeUser(User.serializeUser());       //session encoding
passport.deserializeUser(User.deserializeUser());   //session decoding
passport.use(new LocalStrategy(User.authenticate()));
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded(
      { extended:true }
));
app.use(passport.initialize());
app.use(passport.session());

//=======================
//      R O U T E S
//=======================

app.get("/", (req,res) =>{
    res.render("home", { script:script });
});
app.get("/home", (req,res) =>{
    res.render("home" , { script:script });
});

app.get("/userprofile",isLoggedIn ,(req,res) =>{
    res.render("userprofile", { info:req });
    loggedinUser=req.user.username;
    
    // console.log(req);
});
app.get("/success",(req,res)=>{
    res.render("success");
});
app.get("/booking",(req,res)=>{
    res.render("booking");
});
app.get("/datetime",(req,res)=>{
    res.render("datetime");
});
app.get("/airCondition",(req,res)=>{
    res.render("airCondition");
    // console.log(booked);
    // script.myFunction("abc");
    
    // console.log(script.booked);
});
// let booked;
// function myFunction(x) {
// console.log("x from server called: " +x);
// if(x==="ac-1"){
//   booked="ac Dismounting";
// }
//
// // window.alert(booked);
// return booked;
// }

app.post("/airCondition", (req,res)=>{
    res.render("airCondition");
    var b=script.getVal("xyz");
    console.log("Get valued call: "+b);
    // console.log(req);
  // console.log("booked from server called!" +x);
});

//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login");
});
// app.post("/airCondition", function(req,res){
//  service:
// });
app.post("/login",passport.authenticate("local",{
    successRedirect:"/userprofile",
    failureRedirect:"/login"
}),function (req, res){
// console.log( req);
});

app.get("/signup",(req,res)=>{
    res.render("signup");
});

app.post("/home", function(req, res){
  name=req.body.name;
  email=req.body.email;
  msg=req.body.message;
  const Complaint= new complaint({
    name: name,
    email: email,
    message: msg
  });

  Complaint.save(function(err){

    if (!err){
      console.log(name +" ", email +" ", msg);
      console.log("Complaint saved");
      res.redirect("/home");
    }
    else {
      console.log(err);
      res.redirect("/home");
    }
  });


});

app.post("/signup",(req,res)=>{

    User.register(new User({firstname:req.body.firstname,lastname:req.body.lastname,username:req.body.username,email:req.body.email,address:req.body.address,city:req.body.city,bookedService:"No service booked"}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("signup");
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/success");
    });
  });
});

app.get("/logout",(req,res)=>{
    req.logout();
    loggedinUser="";
    res.redirect("/");

});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    loggedinUser="";
    res.redirect("/login");
}

//Listen On Server


app.listen(process.env.PORT ||3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }

});
module.exports = {loggedinUser};
