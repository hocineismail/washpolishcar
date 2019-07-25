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
 
routes.get("/dash", (req, res) => {
    res.render("Admin/dash")
})

 
routes.get("/", async (req, res) => {

    
    // Start
    // .find({})
    // .sort({'start': 'DESC'})   
    // .exec((err, clients) => {
        
    //    console.log(clients)
    // })
    
    Client
    .find({})
    .populate('location')
    .sort({'start': 'DESC'})
    .limit(4)
    .exec((err, client) => {
        console.log(client)
        res.render("Home/Home", {clients: client})
    })
   
    
})

routes.get("/search", (req, res) => {
  const locations=[{ 
      PositionLatitude: -33.8688,
      PositionLongitude: 151.2195,
      id:1,
     },
     { 
     PositionLatitude: 28.033886,
     PositionLongitude: 1.659626,
     id:2,
     } ]
     res.render("Home/Search", {

      current: 2,
      pages: 10,
      locations: locations
  })

})

routes.get("/data", (req, res) => {
   Location.find({}, (err, locations) => {
     res.render("data", {locations: locations})
   })
})


routes.get('/search/:page', function(req, res, next) {
     
    var perPage = 8
    var page = req.params.page || 1

    Client
        .find({})
        .populate('location')
        .populate('start')
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            Client.countDocuments().exec(function(err, count) {
                console.log(Math.ceil(count / perPage))
                if (err) return next(err)
                res.render("Home/Search", {
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