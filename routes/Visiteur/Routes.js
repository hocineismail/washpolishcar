const express = require("express");
const routes = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");


routes.get("/", (req, res) => {

    res.render("Home/Home")
    
})

routes.get("/404", (req, res) => {
     
    res.render("Home/PageNotFound")

})
         
module.exports = routes;