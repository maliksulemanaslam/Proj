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
const id = new mongoose.Types.ObjectId() //generating id for new booked service

let name, email, msg, loggedinUser, book, b;
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

function booking(req, res){
    if(req.user === undefined){
        console.log('You need to login first')
        return res.render("login", {message: 'You need to login first'})
    }else{
        const date = req.body.date;
        const time = req.body.time;
        const service = req.body.service;
        const price = req.body.price;
        console.log(service, date, price, time)
        User.updateOne({_id: req.user._id},   { 
            $push: { 
                bookedService:  { service, price, date, time}
             } 
           }).then(result => {
            return  res.render("orderPlaced", {message: 'Your order has been placed successfully'});
           }).catch(err=>{
            console.log(err);
            return  res.render("orderPlaced", {message: 'Please try again later. Order could not be placed'});
           
           })
    }
}

//=======================
//      R O U T E S
//=======================

app.get("/", (req,res) =>{
    res.render("home", { script:script });
});
app.get("/home", (req,res) =>{
    res.render("home" , { script:script });
});

app.get("/userProfile",isLoggedIn ,(req,res) =>{
    res.render("userProfile", { info:req,  message: '', bookedService:[], updateService: [] });
    loggedinUser=req.id;
    
    console.log(loggedinUser);
    // console.log("the user session " + req.sessionID);
    // console.log("user: ", req.session.passport.user);
    // console.log("user: ", req.user._id);
});
app.get("/success",(req,res)=>{
    res.render("success");
});
app.get("/orderPlaced",(req,res)=>{
    res.render("orderPlaced", {message: ''});
});
app.get("/booking",(req,res)=>{
    res.render("booking");
});
app.get("/datetime",(req,res)=>{
    res.render("datetime");
});
app.post("/datetime",(req,res)=>{
    res.render("datetime");
    console.log(req.body);
});
app.get("/airCondition",(req,res)=>{
    
    res.render("airCondition",  {message: ''});
    b=script.getVal("xyz");
    console.log("Get valued call: "+b);

});
app.get("/plumber",(req,res)=>{
    res.render("plumber",  {message: ''});
});
app.post("/airCondition", (req,res)=>{
    booking(req,res);
});
app.post("/plumber", (req,res)=>{
    booking(req,res);
});
app.get("/electrician",(req,res)=>{
    res.render("electrician",  {message: ''});
});
app.post("/electrician", (req,res)=>{
    booking(req,res);
});
app.get("/handyman",(req,res)=>{
    res.render("handyman",  {message: ''});
});
app.post("/handyman", (req,res)=>{
    booking(req,res);
});
app.get('/acDismounting', (req, res) => {

    
    myFunction('ac-dismounting')
})
app.get('/acGeneral', (req, res) => {

    
    myFunction('ac-general')
})




// To Get The Previou Service
app.get("/getPreviouslyBookedService", (req, res)=>{
    User.findOne({ "_id": req.user._id })
    .then(result=>{
        if(result.previouslyBooked.length >= 1){
           
            return  res.render("userProfile", {info:req, message: '', bookedService: result.previouslyBooked, updateService: []});
        }else{
 
            return  res.render("userProfile", {info:req, message: 'No Previouly Booked Service', bookedService: [], updateService: []});
        }

    }).catch(err=>{
        console.log(err);
        return  res.render("userProfile", {info:req, message: 'Please try again later. An Error Occured', bookedService:[], updateService: []});
    })
});
// To Get The Service To Be Updated
app.get("/getOrderToUpdate", (req, res)=>{
    User.findOne({ "_id": req.user._id })
    .then(result=>{
        if(result.bookedService.length >= 1){
            return  res.render("userProfile", {info:req, message: '', updateService: result.bookedService, bookedService: []});
        }else{
            return  res.render("userProfile", {info:req, message: 'No Booked Service', updateService: [], bookedService: []});
        }

    }).catch(err=>{
        console.log(err);
        return  res.render("userProfile", {info:req, message: 'Please try again later. An Error Occured',updateService: [], bookedService:[]});
    })
});
app.get("/userprofile-2", (req, res)=>{
    return res.status(200).render('userProfile', { info: req, message: 'Service Succesfully Deleted', bookedService: [], updateService: [] })
});
//To Cancel Order
app.post("/cancelOrder", (req, res)=>{
    const remainingorder = req.query.remainingOrder;
    const remainingArray = [];
     var splitRemaining = remainingorder.split(",")
    for(var i = 0; i < splitRemaining.length; i++){
       let resplitRemaining = splitRemaining[i].split(' ');
       remainingArray.push(resplitRemaining)
    }
    const finalArray = [];
    for(var i = 0; i < remainingArray.length; i++){
        row={
            service: remainingArray[i][0],
            price: remainingArray[i][1],
            date: remainingArray[i][2],
            time: remainingArray[i][3]
        }
        finalArray.push(row)
     }
    User.updateOne({ "_id": req.user._id, },
        { "bookedService": finalArray }
    ).then((result) => {
        console.log(result)
        return res.status(200).render('userProfile', { info: req, message: 'Service Succesfully Deleted',updateService: [], bookedService: [] })
    }).catch(err => {
        console.log(err)
        return res.status(500).render('userProfile', { info: req, message: 'Please Try Again. Service Could Not Be Deleted', updateService: [], bookedService: [] })
    })
});
//To Add to Previously Booked Service
app.post("/updateOrder", (req, res)=>{
    const updateOrder = req.query.updateOrder;
    const remainingOrder = req.query.remainingOrder;
    const updateArray = [];
    const remainingArray = [];
    if(remainingOrder.length >= 1){
        var splitUpdate = updateOrder.split(",");
        var remaining = remainingOrder.split(",");
       for(var i = 0; i < splitUpdate.length; i++){
          let resplitRemaining = splitUpdate[i].split(' ');
          updateArray.push(resplitRemaining)
       }
       for(var i = 0; i < remaining.length; i++){
           let resplitRemaining = remaining[i].split(' ');
           remainingArray.push(resplitRemaining)
        }
       const finalArray = [];
       for(var i = 0; i < updateArray.length; i++){
           row={
               service: updateArray[i][0],
               price: updateArray[i][1],
               date: updateArray[i][2],
               time: updateArray[i][3]
           }
           finalArray.push(row)
        }
        const finalRemainingArray= []
        for(var i = 0; i < remainingArray.length; i++){
           row={
               service: remainingArray[i][0],
               price: remainingArray[i][1],
               date: remainingArray[i][2],
               time: remainingArray[i][3]
           }
           finalRemainingArray.push(row)
        }
    
   
       User.updateOne({ "_id": req.user._id, },
        {
           $push: { "previouslyBooked": finalArray[0] },
            "bookedService": finalRemainingArray }
       ).then((result) => {
           console.log(result)
           return res.status(200).render('userProfile', { info: req, message: 'Service Succesfully Update',updateService: [], bookedService: [] })
       }).catch(err => {
           console.log(err)
           return res.status(500).render('userProfile', { info: req, message: 'Please Try Again. Service Could Not Be Updated', updateService: [], bookedService: [] })
       })
    }else{
        var splitUpdate = updateOrder.split(",");
       for(var i = 0; i < splitUpdate.length; i++){
          let resplitRemaining = splitUpdate[i].split(' ');
          updateArray.push(resplitRemaining)
       }
     
       const finalArray = [];
       for(var i = 0; i < updateArray.length; i++){
           row={
               service: updateArray[i][0],
               price: updateArray[i][1],
               date: updateArray[i][2],
               time: updateArray[i][3]
           }
           finalArray.push(row)
        }
   
       User.updateOne({ "_id": req.user._id, },
        {
           $push: { "previouslyBooked": finalArray[0] },
            "bookedService": [] 
        
       }
       ).then((result) => {
           console.log(result)
           return res.status(200).render('userProfile', { info: req, message: 'Service Succesfully Update',updateService: [], bookedService: [] })
       }).catch(err => {
           console.log(err)
           return res.status(500).render('userProfile', { info: req, message: 'Please Try Again. Service Could Not Be Updated', updateService: [], bookedService: [] })
       })
    }
 
});

//Auth Routes
app.get("/login",(req,res)=>{
    res.render("login", {message:''});
    // console.log(req);
});

app.post("/login",passport.authenticate("local",{
    successRedirect:"/userProfile",
    failureRedirect:"/login"
}),function (req, res){
//  console.log(req);
});

app.get("/signup",(req,res)=>{
    res.render("signup", {message:''});
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

    User.register(new User({firstname:req.body.firstname,lastname:req.body.lastname,username:req.body.username,email:req.body.email,address:req.body.address,city:req.body.city,bookedService:[]}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            res.render("signup", {message:'There was some error or given username already exists'});
        }
    passport.authenticate("local")(req,res,function(){
        res.redirect("/success");
    });
  });
});

app.get("/logout",(req,res)=>{
    req.logout();
    res.redirect("/");
    // loggedinUser="";
    
});

function isLoggedIn(req,res,next) {
    if(req.isAuthenticated()){
        return next();
    }
    loggedinUser="";
    res.redirect("/login");
}

//Listen On Server


app.listen(process.env.PORT || 3000,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port 3000");
    }

});
module.exports = {loggedinUser};
