const express = require("express");
const routes = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");


routes.get("/", (req, res) => {
    console.log("hello dounia")
    res.render("Home/Home")
    
})

routes.get("/404", (req, res) => {
    console.log("hello 404")
    res.render("Home/PageNotFound")

})
         
module.exports = routes;