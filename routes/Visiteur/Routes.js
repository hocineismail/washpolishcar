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
const Visitor =  require("../../models/visitor")

routes.get("/data", (req, res) => {
   console.log("12121112")
})

routes.get("/searchdata",async (req, res) => {
    const user = await User.find({})
    res.send(user)
})
 
routes.get("/", async (req, res) => {
    const visitCount = await Visitor.find({}).count()
    console.log(visitCount)

 if (visitCount != 0) {
    const visitor = await Visitor.find({})
    let NumberVisitor = visitor[0].Visitor + 1;
    visitor[0].Visitor = NumberVisitor
    visitor[0].save().then(() => {
        console.log(visitor) 
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
 } else {
console.log("wach sari hena bitch")
    let newVisitor =  new Visitor({
        Visitor: 1
    });newVisitor.save().then(() => {   
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

}
})
   
   
    


routes.get("/search",async (req, res) => {
    const visitCount = await Visitor.find({}).count()
    if (visitCount != 0 ) {
        const visitor = await Visitor.find({})
        let NumberVisitor = visitor[0].Visitor + 1;
        visitor[0].Visitor = NumberVisitor
        visitor[0].save().then(() => {
        return res.redirect("/search/1")
       })
    } else {
   
        let newVisitor =  new Visitor({
            Visitor: 1
        });newVisitor.save().then(() => {
            return res.redirect("/search/1")
        })
  
       
   }
  
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