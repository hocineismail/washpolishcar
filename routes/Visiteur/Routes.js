const express = require("express");
const routes = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const User = require("../../models/user")
const Client = require("../../models/client");
const Location = require("../../models/location");
const evaluation = require("../../models/evaluation");
routes.get("/", async (req, res) => {
   // const users = await User.find({})
    //const clients = await Client.find({})
    //const locations = await Location.find({})
    console.log("eifrfeom")
   
    
    res.render("Home/Home")
    
})



routes.get("/search",async (req, res) => {
const clients = await Client.find({}).populate('location').populate('evaluation')
if (clients) {
    console.log(clients)
   return res.render("Home/Search", {clients: clients,
        
        current: 2,
        pages: 10,
       
    })
} else  {
    eror
}

})

routes.get('/search/:page', function(req, res, next) {
    var perPage = 8
    var page = req.params.page || 1

    Client
        .find({})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            Client.count().exec(function(err, count) {
                if (err) return next(err)
                res.render('home', {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage)
                })
            })
        })
})

routes.get("/404", (req, res) => {
  
    res.render("Home/PageNotFound")

})


         
module.exports = routes;