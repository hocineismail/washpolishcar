const express = require("express");
const routes = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const User = require("../../models/user")
const Client = require("../../models/client");
const Location = require("../../models/location");
const Evaluation = require("../../models/evaluation");
const Visitor =  require("../../models/visitor")
const Zone =  require("../../models/zone")
const Country =  require("../../models/country")
const {check, validationResult} = require('express-validator/check');

   
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

routes.post("/evaluation/:_page/:_id",[
	check('Evaluation', ' التقييم غير صحيح').not().isEmpty().isLength({ min: 1, max:1 }),
	check('Email', 'حلل في البريد').not().isEmpty(),
  ], async function(req, res) {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array())
		req.flash("error","خلل في ادخال البيانات  البريد او التقييم غير صحيح")	
	    return res.redirect("/store/" + req.params._page)	
	  } else {

    const client = await Client.findOne({_id: req.params._id}).populate({path: 'evaluation',  match: {Email: req.body.Email} })
    console.log(client)
         console.log(client.evaluation.length)
        if (client.evaluation.length != 0) {
            req.flash("error","لقد قمت بتقييم المحل سابقا .لا يمكنك تقييم المحل مرة ثانية")	
            return res.redirect("/store/" + req.params._page)
        } else  {
            let newEvaluation = new Evaluation({
                Email: req.body.Email,
                Evaluations: req.body.Evaluation
            });newEvaluation.save().then(async() => {
                const store = await Client.findOne({_id: req.params._id}).populate('evaluation')
                let laststars = client.Star * store.evaluation.length
                let newstars = parseInt(laststars) + parseInt(req.body.Evaluation )
                let totaldiv = store.evaluation.length + 1
                let star =  newstars / totaldiv
                console.log('length= ' + store.evaluation.length )
                console.log("total star in client : =" + laststars)
                console.log("total all star : =" + newstars)
                console.log("total div in client : =" + totaldiv)
                console.log("total resulkt in client : =" + star)
                // client.Star = 0
                // client.evaluation = []
                client.Star = star
                client.evaluation.push(newEvaluation._id)
                client.save().then(() => {
                    req.flash("success","شكرا على تقييمك للمحل لقد تم نسجيل تقييمك")	
                return res.redirect("/store/" + req.params._page)
                })
            })
          
        }
    }
})



routes.get("/store/:_id",async (req, res) => {
    Client.findOne({_id: req.params._id}).populate('location')
                                        .populate('zone')
                                        .populate('country')
                                        .populate('city').exec(async (err, client) => {
    const user = await User.findOne({client: client._id})
    const user_id = user.client                                  
        if (err) {
            return res.redirect("/search")
        } else {
            console.log(client)
            return res.render("Home/storepage", {user: client,user_id: user_id})
        }
    })
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
    .populate('zone')
    .populate('country')
    .populate('city')
    .sort({'Star': 'DESC'})
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
 
 routes.get('/search/:page', async function(req, res, next) {
      
     var perPage = 8
     var page = req.params.page || 1
 await Zone.find({}, (err, zone) => {
    User
    .find({Role: 'Client'})
    .populate({path: 'client', populate: {path: 'location'}})
    .populate({path: 'client', populate: {path: 'zone'}})
    .populate({path: 'client', populate: {path: 'country'}})
    .populate({path: 'client', populate: {path: 'city'}})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, clients) {
        console.log(clients)
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


 routes.post("/getsearch", (req, res) => {
     console.log("/seach/1/"+ req.body.zone +"/"+ req.body.country +"/"+ req.body.city +"/"+ req.body.store)
     res.redirect("/search/1/"+ req.body.zone +"/"+ req.body.country +"/"+ req.body.city +"/"+ req.body.store)
 })

 routes.get("/search/:page/:zone/:country/:city/:store",async (req, res) => {
    const zone = req.params.zone
    const country = req.params.country
    const city = req.params.city
    const store = req.params.store
    console.log(store)
    let perPage = 12
    let page = req.params.page || 1
    await Zone.find({}, (err, zones) => {
    if 
       (
        (country === "all") &&
        (city === "all") &&
        (store === "all")
       ) {
        
            Client
            .find({})
            .populate('location')
            .populate('zone')
            .populate('country')
            .populate('city')
            .sort({'Star': 'DESC'})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, clients) {
                Client.countDocuments().exec(function(err, count) {
                    console.log(Math.ceil(count / perPage))
                    if (err) {
                        return res.redirect("/search")
                    }
                    res.render("Home/displaySearch", {
                        clients: clients,
                        current: page,
                        pages: Math.ceil(count / perPage),
                        count:count,
                        zone: zones,
                        zoneId: zone,
                        countryId: country,
                        cityId: city,
                        storeId: store
                    })
                })
            })
          
    

    } else if (
        (country != "all") &&
        (city === "all") &&
        (store === "all") 
       ) {
        Client
        .find({country: country})
        .populate('location')
        .populate('zone')
        .populate('country')
        .populate('city')
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            Client.find({country: country}).countDocuments().exec(function(err, count) {
                console.log(Math.ceil(count / perPage))
                if (err) {
                    return res.redirect("/search")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    cityId: city,
                    storeId: store
                })
            })
        })
      

    } else if (
        (country != "all") &&
        (city != "all") &&
        (store === "all")
       ) {
        Client
        .find({country: country, city: city})
        .populate('location')
        .populate('zone')
        .populate('country')
        .populate('city')
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            Client.find({country: country, city: city}).countDocuments().exec(function(err, count) {
                console.log(Math.ceil(count / perPage))
                if (err) {
                    return res.redirect("/search")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    cityId: city,
                    storeId: store
                })
            })
        })
      

    } else if (
        (country != "all") &&
        (city != "all") &&
        (store != "all") 
       ) {
        Client
        .find({country: country, thestore: store})
        .populate('location')
        .populate('zone')
        .populate('country')
        .populate('city')
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
          
            Client.find({country: country, thestore: store}).countDocuments().exec(function(err, count) {
                console.log(count)
                console.log(Math.ceil(count / perPage))
                if (err) {
                    return res.redirect("/search")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    cityId: city,
                    storeId: store
                })
            })
        })
      

    } else    if 
    (
     (country === "all") &&
     (city === "all") &&
     (store != "all")
    ) {
     
         Client
         .find({thestore: store})
         .populate('location')
         .populate('zone')
         .populate('country')
         .populate('city')
         .sort({'Star': 'DESC'})
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, clients) {
             Client.find({thestore: store}).countDocuments().exec(function(err, count) {
                 console.log(Math.ceil(count / perPage))
                 if (err) {
                     return res.redirect("/search")
                 }
                 res.render("Home/displaySearch", {
                     clients: clients,
                     current: page,
                     pages: Math.ceil(count / perPage),
                     count:count,
                     zone: zones,
                     zoneId: zone,
                     countryId: country,
                     cityId: city,
                     storeId: store
                 })
             })
         })
       
 

    } else if (
        (country != "all") &&
        (city === "all") &&
        (store != "all") 
        ) {
        Client
        .find({country: country, thestore: store})
        .populate('location')
        .populate('zone')
        .populate('country')
        .populate('city')
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            Client.find({country: country, thestore: store}).countDocuments().exec(function(err, count) {
                console.log(Math.ceil(count / perPage))
                if (err) {
                    return res.redirect("/search")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    cityId: city,
                    storeId: store
                })
            })
        })
    

    } 

    })

})


 routes.get('/find-store/:page', async function(req, res, next) {
      console.log("stiore")
    var perPage = 12
    var page = req.params.page || 1
await Zone.find({}, (err, zone) => {
   Client
   .find({})
   .populate('location')
   .populate('zone')
   .populate('country')
   .populate('city')
   .sort({'Star': 'DESC'})
   .skip((perPage * page) - perPage)
   .limit(perPage)
   .exec(function(err, clients) {
       Client.countDocuments().exec(function(err, count) {
           console.log(Math.ceil(count / perPage))
           if (err) return next(err)
           res.render("Home/store", {
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