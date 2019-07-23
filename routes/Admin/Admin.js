const express = require("express");
const admin = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const User = require("../../models/user")
const Client = require("../../models/client");
const Location = require("../../models/location");

admin.get("/admin-panel", async (req, res) => {

    res.render("Admin/AdminPanel")
        
})

admin.get("/admin-panel/map", async (req, res) => {

    res.render("Admin/Map")
        
})

admin.get("/admin-panel/List-Users", async (req, res) => {
    User.find({}).populate('client').exec((err, users) => {
        if(users) {
            console.log(users)
            res.render("Admin/Listusers",{users: users})
        } else {
            req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
            return res.redirect("Admin/AdminPanel")
        }
       
    })
   
        
})

admin.get("/admin-panel/My-Compte", async (req, res) => {

    res.render("Admin/AdminMyCompte")
        
})


//uPDATIN COMPTE
admin.get("/admin-panel/delete/:_id", async (req, res) => {
    User.findOneAndDelete({_id: req.params._id},(err,DELETED)=> {
        if (err) { 
          req.flash("error", "حدث خلل اثناء العملية ");
          return   res.redirect("/admin-panel/List-Users")
        
        } else {
            req.flash("error", "قد تم حذف  الحساب ");
          return   res.redirect("/admin-panel/List-Users")
        }
     
        
})})


         
module.exports = admin;