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

routes.get("/test",(req, res) => {
res.render("Home/pagetest")
})


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
     }).populate({path: 'client', populate: {path: 'zone'}})
       .populate({path: 'client', populate: {path: 'country'}})
   console.log(data)
   res.send(data)
})
   


routes.post("/evaluation/:_page/:_id",[
	check('Evaluation', ' التقييم غير صحيح').not().isEmpty().isLength({ min: 1, max:1 }),
	check('Email', 'حلل في البريد').isEmail().not().isEmpty(),
  ], async function(req, res) {  
    const errors = validationResult(req);
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,6}$/; 
        return re.test(String(email).toLowerCase());
    }

    if (!errors.isEmpty() || (validateEmail(req.body.Email)=== false)) {
        console.log(errors.array())
		req.flash("error","خلل في ادخال البيانات  البريد او التقييم غير صحيح")	
	    return res.redirect("/store/" + req.params._page)	
	  } else {

 await Client.findOne({_id: req.params._id}).populate({path: 'evaluation',  match: {Email: req.body.Email} }).exec((err, client) => {
    if (err) {
        req.flash("error","حدث خلل اثناء العملبة")	
        return res.redirect("/store/" + req.params._page)
    } else {
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
   

    }
})



routes.get("/store/:_id",async (req, res) => {
    Client.findOne({_id: req.params._id}).populate('location')
                                        .populate('zone')
                                        .populate('country')
                                        .exec(async (err, client) => {
      if (err) {
    
             return res.redirect("/search/1")
        }
    const user = await User.findOne({client: client._id})
    const user_id = user.client                                  
        if (err) {
            return res.redirect("/search/1")
        } else {
            console.log(client)
            return res.render("Home/storepage", {user: client,user_id: user_id})
        }
    })
})

// routes.get("/searchdata",async (req, res) => {
//     const user = await User.find({})
//     res.send(user)
// })
 
routes.get("/", async (req, res) => {
    const visitCount = await Visitor.find({}).count()
 
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
    
    .sort({'Star': 'DESC'})
    .limit(10)
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
 
routes.post("/post", (req, res) => {
    console.log(req.body)
    res.end()
})

 routes.get('/search/:page', async function(req, res, next) {
      
     var perPage = 12
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
            
        Client.countDocuments().exec(function(err, count) {
        
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
     console.log("/seach/1/"+ req.body.zone +"/"+ req.body.country +"/"+ req.body.store)
     res.redirect("/search/1/"+ req.body.zone +"/"+ req.body.country +"/"+ req.body.store)
 })

 routes.get("/search/:page/:zone/:country/:store",async (req, res) => {
    const zone = req.params.zone
    const country = req.params.country
    const store = req.params.store
    console.log(store)
    let perPage = 6
    let page = req.params.page || 1
    await Zone.find({}, (err, zones) => {
    if 
       (
        (country === "all") &&
        (store === "all")
       ) {
        
            Client
            .find({zone: zone})
            .populate('location')
            .populate('zone')
            .populate('country')            
            .sort({'Star': 'DESC'})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(function(err, clients) {
                if (err) {
                    req.flash("error"," الرابط غير موجود ")
                    return res.redirect("/search")
                } 
                Client.find({zone: zone}).countDocuments().exec(function(err, count) {                  
                    if (err) {
                        req.flash("error"," الرابط غير موجود ")
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
                        storeId: store
                    })
                })
            })
          
    

    } else if (
        (country != "all") &&
        (store === "all") 
       ) {
        Client
        .find({zone: zone,country: country})
        .populate('location')
        .populate('zone')
        .populate('country')
        
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            if (err) {
                return res.redirect("/search")
            } 
            Client.find({zone: zone,country: country}).countDocuments().exec(function(err, count) {
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
                    
                    storeId: store
                })
            })
        })
      

    } else if (
        (country != "all") &&
        (store === "all")
       ) {
        Client
        .find({zone: zone,country: country})
        .populate('location')
        .populate('zone')
        .populate('country')
        
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            if (err) {
                req.flash("error"," الرابط غير موجود ")
                return res.redirect("/search/1")
            } 
            Client.find({zone: zone,country: country}).countDocuments().exec(function(err, count) {
                 
                if (err) {
                    req.flash("error"," الرابط غير موجود ")
                    return res.redirect("/search/1")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    
                    storeId: store
                })
            })
        })
      

    } else if (
        (country != "all") &&
        
        (store != "all") 
       ) {
        Client
        .find({zone: zone,country: country, thestore: store})
        .populate('location')
        .populate('zone')
        .populate('country')
        
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            if (err) {
                req.flash("error"," الرابط غير موجود ")
                return res.redirect("/search/1")
            } 
            Client.find({zone: zone,country: country, thestore: store}).countDocuments().exec(function(err, count) {
                 
                if (err) {
                    req.flash("error"," الرابط غير موجود ")
                    return res.redirect("/search/1")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    
                    storeId: store
                })
            })
        })
      

    } else    if 
    (
     (country === "all") &
     (store != "all")
    ) {
     
         Client
         .find({zone: zone,thestore: store})
         .populate('location')
         .populate('zone')
         .populate('country')
         
         .sort({'Star': 'DESC'})
         .skip((perPage * page) - perPage)
         .limit(perPage)
         .exec(function(err, clients) {
            if (err) {
                req.flash("error"," الرابط غير موجود ")
                return res.redirect("/search/1")
            } 
             Client.find({zone: zone,thestore: store}).countDocuments().exec(function(err, count) {
                 console.log(Math.ceil(count / perPage))
                 if (err) {
                     req.flash("error"," الرابط غير موجود ")
                     return res.redirect("/search/1")
                 }
                 res.render("Home/displaySearch", {
                     clients: clients,
                     current: page,
                     pages: Math.ceil(count / perPage),
                     count:count,
                     zone: zones,
                     zoneId: zone,
                     countryId: country,
                     
                     storeId: store
                 })
             })
         })
       
 

    } else if (
        (country != "all") &&
        (store != "all") 
        ) {
        Client
        .find({zone: zone,country: country, thestore: store})
        .populate('location')
        .populate('zone')
        .populate('country')
        
        .sort({'Star': 'DESC'})
        .skip((perPage * page) - perPage)
        .limit(perPage)
        .exec(function(err, clients) {
            if (err) {
                req.flash("error"," الرابط غير موجود ")
                return res.redirect("/search/1")
            } 
            Client.find({zone: zone,country: country, thestore: store}).countDocuments().exec(function(err, count) {
                console.log(Math.ceil(count / perPage))
                if (err) {
                    req.flash("error"," الرابط غير موجود ")
                    return res.redirect("/search/1")
                }
                res.render("Home/displaySearch", {
                    clients: clients,
                    current: page,
                    pages: Math.ceil(count / perPage),
                    count:count,
                    zone: zones,
                    zoneId: zone,
                    countryId: country,
                    
                    storeId: store
                })
            })
        })
    

    } 

    })

})


 routes.get('/find-store/:page', async function(req, res, next) {
      console.log("stiore")
    var perPage = 6
    var page = req.params.page || 1
await Zone.find({}, (err, zone) => {
   Client
   .find({})
   .populate('location')
   .populate('zone')
   .populate('country')
   
   .sort({'Star': 'DESC'})
   .skip((perPage * page) - perPage)
   .limit(perPage)
   .exec(function(err, clients) {
       Client.countDocuments().exec(function(err, count) {
           
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
    const city =   await Country.findOne({_id: id})
    if (city) {
        console.log(city)
       return res.send(city)
    } else {
        let data = []
    return res.send(data)
    }
    
})


module.exports = routes;