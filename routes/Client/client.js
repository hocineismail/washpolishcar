const express = require("express");
const client = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Client = require("../../models/client");
const Location = require("../../models/location");
const session = require('express-session');
const async =  require("async");
const nodemailer = require('nodemailer');
const crypto = require("crypto");

client.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

client.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
	res.locals.infos = req.flash("info");
	res.locals.success = req.flash("success");
    next();
   })

client.get("/client/my-compte", (req, res) => {
    res.render("Client/Dashboard")
})

module.exports = client;
