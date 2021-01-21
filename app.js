//jshint esversion:6
require('dotenv').config();//for environment variable, must be the first in app.js file.
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const ejs = require("ejs");

const app = express();

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//for encryption (new mongoose.Schema)--------------------------------------------
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

// const secret = "This is our lil secret."; ----to be included in .env file
userSchema.plugin(encrypt, {secret: process.env.secret, encryptedFields: ["password"]});
//----------------------------------------------------------------------------------
const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});
app.get("/login", function(req, res) {
  res.render("login");
});
app.get("/register", function(req, res) {
  res.render("register");
});


app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.render("secrets");
    } else {
      res.send(err);
    }
  });
});

app.post("/login", function(req, res) {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser) {
    if (err) {
      res.send("Invalid username. Please try again.");
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
