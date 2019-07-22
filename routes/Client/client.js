const express = require("express");
const client = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Client = require("../../models/client");
const Location = require("../../models/location");
const session = require('express-session');
const async =  require("async");
const validator = require('validator');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;

client.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));


 
client.get("/client/my-compte",ensureAuthenticated,  async (req, res) => {
    const Client = await User.findOne({_id: req.user._id}).populate('client')
    res.render("Client/MyCompte",{client: Client })
})

client.get("/client/profil", (req, res) => {
    res.render("Client/profil")
})

client.get("/client", (req, res) => {
    res.render("Client/Dashboard")
})

client.get("/client/funding", (req, res) => {
    res.render("Client/Funding")
})

client.get("/client/map", (req, res) => {
    res.render("Client/Map")
})

client.post("/compte-update",async (req, res) => {
    console.log(req.user._id)
    User.findOne({_id: req.user._id}, (err, user) => {
        user.checkPassword(req.body.Password,async function(err, isMatch) {
            if (err) { 
                req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
                return res.redirect("/client/my-Compte"); 
            }
                if (isMatch) { 
                    // if (!validator.isEmail(req.body.email)) {
                    //      req.flash("error", "لم يم تحديث  البيانات");
                    //      return res.redirect("/client/my-Compte"); 
                    // }
                     
                    let client = await  Client.findOne({_id: user.client}) 
                    if (client.Bio != req.body.Bio) {
                        client.Bio = req.body.Bio
                    }
                    if (client.Address != req.body.Address) {
                        client.Address = req.body.Address
                    }
                    if (client.Country != req.body.Country) {
                        client.Country = req.body.Country
                    }
                    if (client.City != req.body.City) {
                        client.City = req.body.City
                    }
                    if (client.Phone != req.body.Phone) {
                        client.Phone = req.body.Phone
                    }
                    client.save()
                    if (user.Firstname != req.body.Firstname) {
                        user.Firstname = req.body.Firstname
                    }
                    if (user.PhonLastnamee != req.body.Lastname) {
                        user.Lastname = req.body.Lastname
                    }
                    if (user.Birthday != req.body.Birthday) {
                        user.Birthday = req.body.Birthday
                    }
                    if (user.Sex != req.body.Sex) {
                        user.Sex = req.body.Sex
                    }

                    if (user.email != req.body.Email) {
                        user.email = req.body.email
                    }

                   
                    user.save((err, success) => {
                        if (success) {
                            console.log(user)
                            req.flash("error", "تم تحديث البيانات بنجاح");
                        return res.redirect("/client/my-Compte"); 
                        }
                    })
   
                } else {
                    console.log('probeleme de password')
                    req.flash('error', 'لم يم تحديث  البيانات بسبب عدم ادخال كلمة المرور الصحيحة');
                    return res.redirect('/client/my-Compte'); 
            }
            });   
    })
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    next();
    } else {
   
    res.redirect("/");
    }
   }


module.exports = client;
