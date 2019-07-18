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

    res.render("Admin/Listusers")
        
})

admin.get("/admin-panel/My-Compte", async (req, res) => {

    res.render("Admin/AdminMyCompte")
        
})





         
module.exports = admin;