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
const Zone =  require("../../models/zone")
const Country =  require("../../models/country")
routes.post("/data",async (req, res) => {

    const data = await Location.find({ 
       PositionLongitude: {
            $gt:  parseFloat(req.body.minlng),
            $lt: parseFloat(req.body.maxlng)  
        },
         PositionLatitude: {
             $gt: parseFloat(req.body.minlat),
             $lt: parseFloat(req.body.maxlat)  
         }
     })
   console.log(data)
   res.send(data)
})
routes.get("/det",async (req, res) => {
   
    res.render("data")
})

routes.post("/body",async (req, res) => {
  var a = 1;
  var b = 2 
  var c = 3
  var e = 4
  
  function getReturn (a, b, c , e) {
      var res = []
      if (a = 1) {
          res = [10, 20, 10,56]
          return res
      }

  } 
     console.log(getReturn(a,b,c,e))
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
   
   
routes.post("/getsearch", (req, res) => {
   console.log(req.body)
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
 
 routes.get('/search/:page', async function(req, res, next) {
      
     var perPage = 8
     var page = req.params.page || 1
 await Zone.find({}, (err, zone) => {
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
                pages: Math.ceil(count / perPage),
                zone: zone
            })
        })
    })
 })

 })

routes.get("/404", (req, res) => {
  
    res.render("Home/PageNotFound")

})

// This parti for ajax
routes.post("/getCountry", async(req, res) => {
    let id  =   req.body.Zone 
    const country =   await Zone.findOne({_id: id}).populate('country')
    if (country) {
        console.log(country)
       return res.send(country)
    } else {
        let data = []
    return res.send(data)
    }
    
})
   


routes.post("/getCiy", async(req, res) => {
    let id  =   req.body.Country 
    const city =   await Country.findOne({_id: id}).populate('city')
    if (city) {
        console.log(city)
       return res.send(city)
    } else {
        let data = []
    return res.send(data)
    }
    
})


module.exports = routes;