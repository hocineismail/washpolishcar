const express = require("express");
const admin = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const User = require("../../models/user")
const Client = require("../../models/client");
const Location = require("../../models/location");

admin.get("/admin-panel", ensureAuthenticated, async (req, res) => {
    if (req.user.Role === 'Admin') {
        return res.render("Admin/AdminPanel")
    } else {
        return req.redirect("/direction")
    }
})

admin.get("/admin-panel/map", ensureAuthenticated, async (req, res) => {

    res.render("Admin/Map")
        
})

admin.get("/admin-panel/List-Users", ensureAuthenticated, async (req, res) => {
    if (req.user.Role === 'Admin') {
      User.find({Role: 'Client'}).populate('client').exec((err, users) => {
        if(users) {
            return res.render("Admin/Listusers",{users: users})
        } else {
            req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
            return res.redirect("Admin/AdminPanel")
        }
       
      })
    } else {
        return req.redirect("/direction")
}
   
        
})

admin.get("/admin-panel/My-Compte", ensureAuthenticated, async (req, res) => {
    if (req.user.Role === 'Admin') {
       return res.render("Admin/AdminMyCompte")
    } else {
        return req.redirect("/direction")
    }
})


//uPDATIN COMPTE
admin.get("/admin-panel/delete/:_id", ensureAuthenticated, async (req, res) => {
    if (req.user.Role === 'Admin') {
    User.findOneAndDelete({_id: req.params._id},(err,DELETED)=> {
        if (err) { 
          req.flash("error", "حدث خلل اثناء العملية ");
          return   res.redirect("/admin-panel/List-Users")
        
        } else {
            req.flash("error", "قد تم حذف  الحساب ");
          return   res.redirect("/admin-panel/List-Users")
        }
     
        
})
    } else {
          return req.redirect("/direction")
    }
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    next();
    } else {
   
    res.redirect("/");
    }
   }
         
module.exports = admin;