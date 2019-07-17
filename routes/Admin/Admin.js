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






         
module.exports = admin;