//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
var encrypt = require('mongoose-encryption');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

let port = process.env.PORT;
if (port == null || port == "") {
  port = 5000;
}


app.listen(port, function() {
  console.log("Server started on port 3000");
});


/////////////////////DATABASE
mongoose.connect('mongodb+srv://bala:pass@cluster0.8i6fk.mongodb.net/taskauthenticationDB',{ useNewUrlParser: true,useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});

const User = mongoose.model('User', userSchema);
/////////////////////////////




///////////////////////////////////////////////////////////---SERVER---/////////////////////////////////////////////////////////
app.route("/")

    .get(function(req,res){
      res.render("home");
    });



app.route("/userdetails")

     .get(function(req,res){

       User.find({}, function(err, foundUser){

     res.render("userdetails",{User: foundUser });
     console.log(foundUser);
     });



     });



app.route("/register")

     .get(function(req,res){
       res.render("register");
     })

     .post((req,res) => {
       const newUser = new User({
         name:req.body.name,
         email: req.body.username,
         password: req.body.password
       });

       newUser.save((err) => {
         if(!err){
           res.render("success");
         }else{
           res.send("sorry,something went wrong...");
         }
       });
     });



app.route("/login")

    .get(function(req,res){
      res.render("login");
    })

    .post((req,res) => {
      const name = req.body.name;
      const userName = req.body.username;
      const password = req.body.password;

      User.findOne({email: userName}, function(err,foundUser){
        if(err){
          console.log(err);
        }else{
          if(foundUser){
            if(foundUser.password === password){
              res.render("userdetails");
            }else{
              res.send("<h1>Invalid Credentials</h1>");
            }
          }
        }
      });
    });
