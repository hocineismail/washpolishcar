
const express = require('express');
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash"); 
const passport = require("passport");

mongoose.connect("mongodb://localhost:27017/cars");

// routes
const Home = require("./routes/Visiteur/Routes")
const auth = require("./routes/Authentification/auth")
const admin = require("./routes/Admin/Admin")

const setUpPassport = require('./routes/Authentification/setuppassport')
setUpPassport()


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cookieParser())

app.use(
  session({
    secret: 'TKRv0IJs=HYqrvagQ#&!F!%V]Ww/4KiVs$s,<<MX',
    resave: true,
    saveUninitialized: true,         

  })
)

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//using folder views
app.use(express.static(__dirname + '/public'))
app.engine('ejs', require('ejs').renderFile)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// using routes
app.use(Home)
app.use(auth)
app.use(admin)



app.post("/login", passport.authenticate("login", {
	successRedirect: "/admin-panel",
	failureRedirect: "/login",
	failureFlash: true
 }));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
  next();
  } else {
 
  res.redirect("/");
  }
 }
 app.get('*', function(req, res){
  res.redirect("/404")
});
app.listen(3000, () => {
  console.log('Server listing on 3000')
})
