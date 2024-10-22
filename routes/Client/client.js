 
const express = require("express");
const client = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Client = require("../../models/client");
const Year = require("../../models/year");
const Month = require("../../models/month");
const Day = require("../../models/day");
const Location = require("../../models/location");
const Zone = require("../../models/zone");
const City = require("../../models/city");
const Country = require("../../models/country");
const session = require('express-session');
const async =  require("async");
const validator = require('validator');
const path = require("path")
const crypto = require("crypto");
const LocalStrategy = require("passport-local").Strategy;
const {check, validationResult} = require('express-validator/check');
const multer = require('multer');
const fs = require('fs')
client.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));


client.get('/info',async (req, res) => {
    const client = await Client.findOne({_id: req.user.client}).populate({path: 'year', populate: { path: 'month'}});
    console.log(client)
})

client.post("/store-update",[

], async function(req, res) {  
const errors = validationResult(req);

if (!errors.isEmpty()) {
    let error = errors.array()
 
   res.redirect("/client/my-Compte")	
  } else {

    
    if (req.user.Role === 'Client') {
        User.findOne({_id: req.user._id}, (err, user) => {
          user.checkPassword(req.body.Password,async function(err, isMatch) {
              if (err) { 
                  req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
                  return res.redirect("/client/my-Compte"); 
              }
                  if (isMatch) { 

//Contrl 
var email = req.body.email;
console.log(" cbn dekhel la function sans probeleme")
async function  getIdInformation () {


    return new Promise(function(resolve, reject) {
const arrayId = []
  if ((req.body.valuecheckboxzone === 'on') && 
     (req.body.valuecheckboxcountry === undefined) &&
     (req.body.newCity != '') &&
     (req.body.newCountry != '') &&
     (req.body.newZone != '') &&
    (req.body.valuecheckboxcountry === undefined))  { 
     let newCity =  new City({
         City: req.body.newCity
     });newCity.save().then(() => {	 
         let newCountry = new Country({
             Country: req.body.newCountry,
             city:  newCity._id 
         });newCountry.save().then(() => {
          
            let newZone = new Zone({
                Zone: req.body.newZone,
                country:  newCountry._id 
            });newZone.save().then(() => {
                
                arrayId.push(newZone._id, newCountry._id, newCity._id)				
                resolve(arrayId)				   
            })
         })
     })
} else if ( (req.body.valuecheckboxzone === undefined) && 
            (req.body.valuecheckboxcountry === 'on')   &&
            (req.body.newCity != '') &&
            (req.body.newCountry != '') &&
            (req.body.Zone != '') &&
            (req.body.valuecheckboxcity ===  undefined)) {
             
                let newCity =  new City({
                    City: req.body.newCity
                });newCity.save().then(() => {
                    let newCountry = new Country({
                        Country: req.body.newCountry,
                        city: newCity._id
                    });newCountry.save().then(async() => {
                     let zone =  await Zone.findOne({_id: req.body.Zone})
                     zone.country.push(newCountry._id)
                     zone.save().then(() => {
                        arrayId.push(zone._id, newCountry._id, newCity._id)
                        resolve(arrayId)							
                     })
                    })	
                })

} else if ((req.body.valuecheckboxzone === undefined)    && 
           (req.body.valuecheckboxcountry === undefined) &&
           (req.body.newCity != '') &&
           (req.body.Country != '') &&
           (req.body.Zone != '') &&
           (req.body.valuecheckboxcity === 'on'))  {
            

               // create a new city 				   
                let newCity =  new City({
                    City: req.body.newCity
                });newCity.save().then(async() => {
                    let country = await Country.findOne({_id: req.body.Country})
                    country.city.push(newCity._id)
                    country.save().then(async() => { 
                        let zone =  await Zone.findOne({_id: req.body.Zone})
                        zone.country.push(Country._id)
                        arrayId.push(zone._id, country._id, newCity._id)
                        resolve(arrayId)
                    })
                })

} else if ((req.body.valuecheckboxzone === undefined) && 
(req.body.valuecheckboxcountry === undefined) &&
(req.body.valuecheckboxcity === undefined)) {
    arrayId.push(req.body.Zone, req.body.Country, req.body.City)
    resolve(arrayId)
}

    })
}

async function CreateNewUser() {
 try{
     let ArrayId  = await  getIdInformation ();
     let client = await Client.findOne({_id: user.client})
     console.log(ArrayId)
     console.log(client)
                         
                            client.Address = req.body.Address,
                            client.zone = ArrayId[0],
                            client.country = ArrayId[1],
                            client.city = ArrayId[2],
                                   
            
            client.save((err, success) => {
                console.log('--------------')
                console.log(client)
                if (err) {console.log("eror")}
                else {return res.redirect("/client/my-Compte")}
               
            })


                      


   

 }
catch(err) {
  console.log(err);
 }
}

CreateNewUser()


                } else {
                    console.log('probeleme de password')
                    req.flash('error', 'لم يم تحديث  البيانات بسبب عدم ادخال كلمة المرور الصحيحة');
                    return res.redirect('/client/my-Compte'); 
            }
            });   
       })
     } else {
        return res.redirect("/direction") 
     }



}

})


// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
      cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
  
  // Init Upload
  const upload = multer({
    storage: storage, 
   //You ccan change filsesize
    limits: { fileSize: 50000000 },
    fileFilter: function(req, file, cb){
      checkFileType(file, cb);
    }
  }).single('Picter');
  
  // Check File Type
  function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);
  
    if(mimetype && extname){
      return cb(null,true);
    } else {
      cb('Error: Message error!');
    }
  }
  

  
 
  
  client.post('/PostPicter',async (req, res) => {
  
    console.log(req.body.Picter)
  
    console.log("routes")
    upload(req, res, async (err) => {
      if(err){
        res.redirect("/client/my-Compte");
         console.log('Error: of Uploading')
      } else {
        if(req.file == undefined){
            console.log('Error: No File Selected!')
          res.redirect("/client/my-Compte");
  
        } else {
          const client = await Client.findOne({_id: req.user.client})
          if (client) {
              if (client.ImageUrl != null) {
                const path = "public/uploads/"+client.ImageUrl
                console.log("path erroro je sais pas win" + path)
                fs.unlink(path, (err) => {
                  if (err) {
                    console.error(err)
                  
                  }
                  console.log('file deleted successfully');
                })
              }
       
              client.ImageUrl = req.file.filename
              client.save((err, saved) => {
                  console.log(client)
                  if (err) {return console.log('error')}
                  res.redirect("/client/my-Compte");
              } )
          }
          
  
        }
      }
    });
  });
  
  
  



client.get("/add-months/:_id/:month", ensureAuthenticated, async (req, res) => {
   await Year.findOne({_id: req.params._id }, (err, year) => {
       if (year) {
            let newMonth = new Month({
                Month: req.params.month,
                FinancialIncomeMonth: 0,
                FinancialExitMonth: 0,
            });
            newMonth.save().then(() => {
                console.log(newMonth)
                year.month.push(newMonth._id)
                year.save().then(() => {
                    req.flash("success","the month has added with success")
                    return res.redirect("/client/funding-month/" + req.params._id)
                })
            })
       } else {
        console.log("newMonth")
            req.flash("error"," there is a error in this page")
            return res.redirect("/client/funding-month/" + req.params._id)
       }
   })
})

client.get("/client/funding", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        const FundingOfYear = await Client.findOne({_id: req.user.client}).populate('year');
        
        return res.render("Client/Funding", {funding: FundingOfYear})
    } else {
        return res.redirect("/direction") 
     }
})
 


client.post("/fundingday", ensureAuthenticated,async (req, res) => {
    
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay
    const FinancialExitInDay = req.body.FinancialExitInDay
    console.log(typeof(req.body.FinancialIncomeInDay))
    if (
         
       ( FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
  
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined)
        ) {
            const year = new Date().getFullYear()
            const month = new Date().getMonth() + 1
            const day = new Date().getDate()
            const client = await Client.findOne({_id: req.user.client}).populate({path: 'year', populate: { path: 'month'}});
            const DaysInmonth =  new Date(year, month, 0).getDate();
            const DaysInYear = year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
            let YearExist = []
            let MonthExist = []
            let DayExist = []
            console.log(day)
            async function IfExisted () {
            for  (let i = 0 ; i < client.year.length ; i++ ) {
                if (client.year[i].Year === year) {      
                    YearExist.push(client.year[i]._id)
                    console.log('Ther Is Year')
                    for(let j = 0 ; j < client.year[i].month.length ; j++ ) {
                        if (client.year[i].month[j].Month === month) {
                            MonthExist.push(client.year[i].month[j]._id)
                            console.log('There is month')
                            let DayId = client.year[i].month[j].day
                            
                            const DayLoop = await Day.find({_id: DayId})
                            console.log('+++++-----*****////***--++++')
                            console.log(DayLoop)
                            console.log('+++++-----*****////***--++++')
                            for(let k = 0 ; k < DayLoop.length ; k++ ) {
                                console.log(DayLoop[k])
                                if (DayLoop[k].Day === day) {
                                    console.log('haho ya nami'+DayLoop[k])
                                    DayExist.push(true)
                                    console.log("the is day")
                                    req.flash("error", "errorororrroroor")
                                   return res.redirect("/client")
                               }
                            }
                       }
                    }
                }    
            }
             
           }
            IfExisted ().then(() => {
            if (YearExist.length === 0) { 
                console.log("there is no Year !!! create a new year DONE") 
                let newDay = new Day({
                    Day: day,
                    FinancialIncomeInDay: FinancialIncomeInDay,
                    FinancialExitInDay: FinancialExitInDay,
                 });
                 console.log(FinancialExitInDay);
                 newDay.save().then(() => {
                        console.log('create NEWDAY DONE')      
                    let newMonth = new Month({
                        Month: month,
                        FinancialIncomeMonth: FinancialIncomeInDay / DaysInmonth,
                        FinancialExitMonth: FinancialExitInDay / DaysInmonth,
                        day: newDay._id
                     });newMonth.save().then(() => {
                        console.log('create MONTH DONE')  
                         if (DaysInYear) {
                            let newYear = new Year({
                                Year: year,
                                FinancialIncomeYear: FinancialIncomeInDay / 366,
                                FinancialExitYear: FinancialExitInDay / 366,
                                month: newMonth._id
                             }); 
                             console.log(newYear);
                             newYear.save().then(() => {
                                client.year = newYear._id;
                                client.save().then(() => {
                                    console.log(newDay)
                                    console.log("pas eddor hena wach ken ya rab 3ali ???")
                                    return res.redirect("/client")
                                })
                          })
                         } else {
                            let newYear = new Year({
                                Year: year,
                                FinancialIncomeYear: FinancialIncomeInDay / 365,
                                FinancialExitYear: FinancialExitInDay / 365,
                                month: newMonth._id
                             });
                             console.log(newYear);
                              newYear.save().then(() => {
                               client.year = newYear._id;
                               client.save().then(() => {
                                   console.log(newDay)
                                   console.log("pas eddor hena wach ken ya rab 3ali ???")
                                   return res.redirect("/client")
                               })
                         })
                         }
        
                         
                         
                        
                     })
                 })
        
        
              
                 
             } else if (MonthExist.length === 0) {
                let newDay = new Day({
                    Day: day,
                    FinancialIncomeInDay: FinancialIncomeInDay,
                    FinancialExitInDay: FinancialExitInDay,
                 });
                 console.log(FinancialExitInDay);
                 newDay.save().then(() => {
                              
                    let newMonth = new Month({
                        Month: month,
                        FinancialIncomeMonth: FinancialIncomeInDay / DaysInmonth,
                        FinancialExitMonth: FinancialExitInDay / DaysInmonth,
                        day: newDay._id
                     });newMonth.save().then(() => {   
                        if (DaysInYear) { 
                            let ResultInCome = lient.year[0].FinancialIncomeYear + ( FinancialIncomeInDay / 366)
                            let ResultExit = client.year[0].FinancialExitYear + (FinancialExitInDay / 366)
                            client.year[0].FinancialIncomeYear = ResultInCome
                            client.year[0].FinancialExitYear  =ResultExit
                            client.year[0].month.push(newMonth._id)
                            client.save().then(() => {
                                console.log(client.year[0].month)
                                console.log("pas eddor hena wach ken ya rab 3ali ???")
                                return res.redirect("/client")
                            })
                        } else {
                            let ResultInCome = lient.year[0].FinancialIncomeYear + ( FinancialIncomeInDay / 365)
                            let ResultExit = client.year[0].FinancialExitYear + (FinancialExitInDay / 365)
                            client.year[0].FinancialIncomeYear = ResultInCome
                            client.year[0].FinancialExitYear  =ResultExit
                            client.year[0].month.push(newMonth._id)
                            client.save().then(() => {
                                console.log(client.year[0].month)
                                console.log("pas eddor hena wach ken ya rab 3ali ???")
                                return res.redirect("/client")
                            })
                        }
                               
                         
                     })
                 })
             } else if (DayExist.length === 0) {
                let newDay = new Day({
                    Day: day,
                    FinancialIncomeInDay: FinancialIncomeInDay,
                    FinancialExitInDay: FinancialExitInDay,
                 });
               
                 newDay.save().then(async() => { 
                     
                    let Getmonth = await Month.findOne({_id: MonthExist[0]})      
                
                    let ResultInCome = Getmonth.FinancialIncomeMonth + ( FinancialIncomeInDay / DaysInmonth)
                    let ResultExit = Getmonth.FinancialExitMonth + ( FinancialExitInDay / DaysInmonth)
                    console.log("----------------------++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
                    console.log(ResultInCome)
                    console.log(( FinancialIncomeInDay / DaysInmonth))
                    console.log('---+++***///***--+++++')
                    console.log(DaysInmonth)
                    Getmonth.FinancialIncomeMonth = ResultInCome
                    Getmonth.FinancialExitMonth =  ResultExit
                    Getmonth.day.push(newDay._id)
                    Getmonth.save().then(async() => {
                        if (DaysInYear) {
                                     
                            let Getyear = await   Year.findOne({month: Getmonth._id}) 
                            let ResultInComeYear =   Getyear.FinancialIncomeYear + (FinancialIncomeInDay / 366)
                            let ResultExitYear   =   Getyear.FinancialExitYear + (FinancialExitInDay / 366)
                                console.log('--------------')
                            Getyear.FinancialIncomeYear = ResultInComeYear
                            Getyear.FinancialExitYear = ResultExitYear
                            Getyear.save().then(() => {
                                console.log(Getyear )
                                console.log("Added funding day")
                                return res.redirect("/client")
                            })
                            
                        } else {
                            console.log("1111111111111")
                           
                            let Getyear = await Year.findOne({month: Getmonth._id}) 
                            let ResultInComeYear = Getyear.FinancialIncomeYear + (FinancialIncomeInDay / 365)
                            let ResultExitYear   = Getyear.FinancialExitYear + (FinancialExitInDay / 365)
                                console.log('--------------')
                                console.log(ResultInComeYear)
                                console.log('----******----')
                                console.log(ResultExitYear)
                                console.log('----++++++----')
                                console.log(Getyear.FinancialIncomeYear )
                                console.log('----//////----')
                                console.log(Getyear.FinancialExitYear )
                            Getyear.FinancialIncomeYear = ResultInComeYear
                            Getyear.FinancialExitYear = ResultExitYear
                            Getyear.save().then(() => {
                                console.log('-----------------')
                                console.log(Getyear )
                                console.log("Added funding day")
                                return res.redirect("/client")
                            })
                        }
                       
                     })
                 })
             }
        })
        
        } else {
            console.log("erroro")
            return res.redirect("/client")
        }
  
     
   
})

client.post("/add-funding-day/:MonthId/:day", ensureAuthenticated, async (req, res) => {
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay;
        const FinancialExitInDay = req.body.FinancialExitInDay;
    if (

       ( FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
      
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined)
        ) {
    const month = await Month.findOne({_id: req.params.MonthId})
    if (month) {
        const FinancialIncomeInDay = req.body.FinancialIncomeInDay;
        const FinancialExitInDay = req.body.FinancialExitInDay;
        let newDay = new Day({
            Day: req.params.day,
            FinancialIncomeInDay: FinancialIncomeInDay,
            FinancialExitInDay: FinancialExitInDay,
        });newDay.save().then(async () => {
            const year = await Year.findOne({month: month._id})
            if (year) {
                const DaysInmonth =  new Date(year.Year, month.Month, 0).getDate();
                // this is the resulat in the month
                let ResultIncome =  (FinancialIncomeInDay / DaysInmonth)
                let ResultExit =   (FinancialExitInDay / DaysInmonth)
                month.FinancialIncomeMonth =  (month.FinancialIncomeMonth + ResultIncome)
                month.FinancialExitMonth =  (month.FinancialExitMonth + ResultExit )
                month.day.push(newDay._id)
                month.save().then( () => {
                    const DaysInYear = year.Year % 400 === 0 || (year.Year % 100 !== 0 && year.Year % 4 === 0);
                     // DaysInYear if true is 366 is false is 365
                    if (DaysInYear) {
                        let ResultIncome =  ( FinancialIncomeInDay / 366)
                        let ResultExit =   ( FinancialExitInDay / 366)
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            console.log("bien ajouti bro ")
                            return  res.redirect("/client/funding-days/" +  res.params.MonthId)
                        })
                    } else {
                        let ResultIncome =  ( FinancialIncomeInDay / 365 )
                        let ResultExit =   ( FinancialExitInDay / 365 )
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            console.log("bien ajouti bro ")
                            return  res.redirect("/client/funding-days/" +  req.params.MonthId)
                        })
                    }
                })
            }
        })    
    } else {
      req.flash("error", " message of error")
      return  res.redirect("/client/funding-days/" +  req.params.MonthId)
    }
 } else {
    req.flash("error", " message of error")
    return  res.redirect("/client/funding-days/" +  req.params.MonthId)
 }
})
client.post("/add-funding-day/:MonthId/:day/client", ensureAuthenticated, async (req, res) => {
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay;
        const FinancialExitInDay = req.body.FinancialExitInDay;
    if (

       ( FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
      
        (FinancialExitInDay != null) &&
        (FinancialExitInDay != undefined)
        ) {
    const month = await Month.findOne({_id: req.params.MonthId})
    if (month) {
        const FinancialIncomeInDay = req.body.FinancialIncomeInDay;
        const FinancialExitInDay = req.body.FinancialExitInDay;
        let newDay = new Day({
            Day: req.params.day,
            FinancialIncomeInDay: FinancialIncomeInDay,
            FinancialExitInDay: FinancialExitInDay,
        });newDay.save().then(async () => {
            const year = await Year.findOne({month: month._id})
            if (year) {
                const DaysInmonth =  new Date(year.Year, month.Month, 0).getDate();
                // this is the resulat in the month
                let ResultIncome =  (FinancialIncomeInDay / DaysInmonth)
                let ResultExit =   (FinancialExitInDay / DaysInmonth)
                month.FinancialIncomeMonth =  (month.FinancialIncomeMonth + ResultIncome)
                month.FinancialExitMonth =  (month.FinancialExitMonth + ResultExit )
                month.day.push(newDay._id)
                month.save().then( () => {
                    const DaysInYear = year.Year % 400 === 0 || (year.Year % 100 !== 0 && year.Year % 4 === 0);
                     // DaysInYear if true is 366 is false is 365
                    if (DaysInYear) {
                        let ResultIncome =  ( FinancialIncomeInDay / 366)
                        let ResultExit =   ( FinancialExitInDay / 366)
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            console.log("bien ajouti bro ")
                            return  res.redirect("/client/funding-days/" +  res.params.MonthId)
                        })
                    } else {
                        let ResultIncome =  ( FinancialIncomeInDay / 365 )
                        let ResultExit =   ( FinancialExitInDay / 365 )
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            console.log("bien ajouti bro ")
                            return  res.redirect("/client" )
                        })
                    }
                })
            }
        })    
    } else {
      req.flash("error", " message of error")
      return  res.redirect("/client" )
    }
 } else {
    req.flash("error", " message of error")
    return  res.redirect("/client" )
 }
})

client.get("/client/my-compte", ensureAuthenticated,ensureAuthenticated,  async (req, res) => {
    if (req.user.Role === 'Client') {
    const Client = await User.findOne({_id: req.user._id}).populate({path: 'client', populate: {path: 'zone'}})
                                                          .populate({path: 'client',  populate: {path: 'country'}})
                                                          .populate({path: 'client', populate: {path: 'city'}})
                                                          .populate({path: 'client',  populate: {path: 'location' }}) 
                                                        
    const zone = await Zone.find({})                                                 
       return  res.render("Client/MyCompte",{client: Client, zone: zone })
    } else {
       return res.redirect("/direction") 
    }
})


client.get("/client", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        console.log(day)
        let YearExist = []
        let MonthExist = []
        let theday = []
      const client =  await Client.findOne({_id: req.user.client}).populate({path: 'year', populate: { path: 'month'}}).exec(async(err, client) => {
          async function GetDayExist() {
            for (let i = 0 ; i < client.year.length ; i++ ) {
                if (client.year[i].Year === year) {      
                    YearExist.push(year)
                    console.log('boucle years pas d error')
                    for(let j = 0 ; j < client.year[i].month.length ; j++ ) {
                        if (client.year[i].month[j].Month === month) {
                            MonthExist.push(client.year[i].month[j])
                            console.log('boucle month pas pas d error')
                            let DayId = client.year[i].month[j].day
                            
                            const DayLoop = await Day.find({_id: DayId})
                            console.log(DayLoop)
                            for(let k = 0 ; k < DayLoop.length ; k++ ) {
                                if (DayLoop[k].Day === day) {
                                    const  thismonth =  await Month.findOne({_id: MonthExist[0]._id}).populate('day')
                                    console.log("hena kayna errror")
                                    console.log(thismonth)
                                    theday.push('1')
                                   let dayExist = DayLoop[k]
                                   return res.render("Client/Dashboard", {dayExist: dayExist, thismonth: thismonth})
                               }
                            }
                       }
                    }
                }    
            }
          }
          GetDayExist().then( async() => {
              
            if ((theday.length === 0) && (MonthExist.length != 0) ) {
                const  thismonth =  await Month.findOne({_id: MonthExist[0]._id}).populate('day')
                let dayExist = 0
                return res.render("Client/Dashboard", {dayExist: dayExist, thismonth: thismonth})
            } else if (YearExist.length === 0) {
                const  thismonth =  []
                let dayExist = 0
                return res.render("Client/Dashboard", {dayExist: dayExist, thismonth: thismonth})
            }
          })
        });
        
       
    
 
     } else {
       return res.redirect("/direction") 
    }
})



client.get("/client/funding-month/:_id", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
       const YearID = await Year.findOne({_id: req.params._id}).populate('month')
            console.log(YearID)
            return res.render("Client/FundingMonth", {months: YearID})
     
       
    } else {
        return res.redirect("/direction") 
     }
})

client.get("/client/funding-days/:_id", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
       const YearID = await Month.findOne({_id: req.params._id}).populate('day')
            console.log(YearID)
            return res.render("Client/FundingDays", {days: YearID})
     
       
    } else {
        return res.redirect("/direction") 
     }
})


client.get("/client/map", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
        const clients = await Client.find({}).populate('location')
        const PositionCurrently = await User.findOne({_id: req.user._id}).populate({path: 'client', populate: { path: 'location' }})
        console.log(PositionCurrently)
       return res.render("Client/Map", {clients: clients, PositionCurrently: PositionCurrently})
    } else {
       return res.redirect("/direction") 
    }
})

client.post("/compte-update", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
      User.findOne({_id: req.user._id}, (err, user) => {
        user.checkPassword(req.body.Password,async function(err, isMatch) {
            if (err) { 
                req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
                return res.redirect("/client/my-Compte"); 
            }
                if (isMatch) { 
                    // if (!validator.isEmail(req.body.email)) {
                    //      req.flash("error", "لم يم تحديث  البيانات");
                    //      return res.redirect("/client/my-Compte"); 
                    // }
                     
                    let client = await  Client.findOne({_id: user.client}) 
  
                    if (client.username != req.body.username) {
                        client.username = req.body.username
                     
                    }
                   
                    if (client.Phone != req.body.Phone) {
                        client.Phone = req.body.Phone
                    }
                    if (client.thestore != req.body.store) {
                        client.thestore = req.body.store
                    }
                    if (client.municipallicense != req.body.MunicipalLicense) {
                        client.municipallicense = req.body.MunicipalLicense
                    }

                    if (client.commercialregister != req.body.CommercialRegister) {
                        client.commercialregister = req.body.CommercialRegister
                    }
                    client.save()
                    if (user.Fullname != req.body.Fullname) {
                        user.Fullname = req.body.Fullname
                    }

                    if (user.email != req.body.Email) {
                        user.email = req.body.email
                    }

                   
                    user.save((err, Success) => {
                        if (Success) {
                            console.log(user)
                            req.flash("success", "تم تحديث البيانات بنجاح");
                        return res.redirect("/client/my-Compte"); 
                        }
                    })
   
                } else {
                    console.log('probeleme de password')
                    req.flash('error', 'لم يم تحديث  البيانات بسبب عدم ادخال كلمة المرور الصحيحة');
                    return res.redirect('/client/my-Compte'); 
            }
            });   
       })
     } else {
        return res.redirect("/direction") 
     }
})

client.post("/update-position", ensureAuthenticated,async (req, res) => {

    if (req.user.Role === 'Client') {
        const PositionLatitude = req.body.PositionLatitude;
        const PositionLongitude = req.body.PositionLongitude
        User.findOne({_id: req.user._id}, (err, user) => {
          user.checkPassword(req.body.Password,async function(err, isMatch) {
              if (err) { 
                  req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
                  return res.redirect("/client/my-Compte"); 
              }
                  if (isMatch) { 
                      // if (!validator.isEmail(req.body.email)) {
                      //      req.flash("error", "لم يم تحديث  البيانات");
                      //      return res.redirect("/client/my-Compte"); 
                      // }
                       
                      let client = await  Client.findOne({_id: user.client}) 
                      let location = await Location.findOne({_id: client.location})
                      location.PositionLatitude = PositionLatitude
                      location.PositionLongitude  = PositionLongitude
                      location.save((err, Success) => {
                          if (Success) {
                              console.log(user)
                              req.flash("success", "تم تحديث البيانات بنجاح");
                              return res.redirect("/client/my-Compte"); 
                          }
                      })
     
                  } else {
                      console.log('probeleme de password')
                      req.flash('error', 'لم يم تحديث  البيانات بسبب عدم ادخال كلمة المرور الصحيحة');
                      return res.redirect('/client/my-Compte'); 
              }
              });   
         })
       } else {
          return res.redirect("/direction") 
       }
})

client.post("/update-funding-day/:IdOfPage/:_id", ensureAuthenticated,async (req, res) => {
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay
    const FinancialExitInDay = req.body.FinancialExitInDay
    if (
         
       ( FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
 
        (FinancialExitInDay != null) &&
        (FinancialExitInDay != undefined)
        ) {
   if (req.params.IdOfPage === 'null') {
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay
    const FinancialExitInDay = req.body.FinancialExitInDay

    Day.findOne({_id: req.params._id},async (err, getDay) => {
        // save The prince before update in PrinceBeforeUpdate for next opreation 
      const PrinceBeforeUpdate = getDay;
      let month = await Month.findOne({day: req.params._id})
      let year = await Year.findOne({ month: month._id})
      // Get number of day in this month
      const DaysInmonth =  new Date(year.Year, month.Month, 0).getDate();
       // Get number of day in this year
      const DaysInYear = year.Year % 400 === 0 || (year.Year % 100 !== 0 && year.Year % 4 === 0);
      

      //change the value of prince in month and in year

      let NewResultInComeInMonth = ( month.FinancialIncomeMonth + ((FinancialIncomeInDay / DaysInmonth) - (PrinceBeforeUpdate.FinancialIncomeInDay  / DaysInmonth)))
      let NewResultExitnMonth = ( month.FinancialExitMonth + ((FinancialExitInDay / DaysInmonth) - (PrinceBeforeUpdate.FinancialExitInDay  / DaysInmonth)))
      console.log(PrinceBeforeUpdate.FinancialIncomeInDay)
        if (getDay) {
                month.FinancialIncomeMonth = NewResultInComeInMonth;
                month.FinancialExitMonth = NewResultExitnMonth
                month.save().then(() => {
                    if (DaysInYear) {

                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 366) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 366)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 366) - (PrinceBeforeUpdate.FinancialExitInDay  / 366)))
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { req.flash("success", " updating")
                            res.redirect("/client")})
                            
                        })
                    } else {
 
                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 365) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 365)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 365) - (PrinceBeforeUpdate.FinancialExitInDay  / 365)))
                       
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            console.log(year)
                            console.log("fat get day ")
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { req.flash("success", " updating")
                            res.redirect("/client")})
                            
                        })
                    }

                })
                
          
        }
    })
   } else {
    const FinancialIncomeInDay = req.body.FinancialIncomeInDay
    const FinancialExitInDay = req.body.FinancialExitInDay
    Day.findOne({_id: req.params._id},async (err, getDay) => {
        // save The prince before update in PrinceBeforeUpdate for next opreation 
      const PrinceBeforeUpdate = getDay;
      let month = await Month.findOne({day: req.params._id})
      let year = await Year.findOne({ month: month._id})
      // Get number of day in this month
      const DaysInmonth =  new Date(year.Year, month.Month, 0).getDate();
       // Get number of day in this year
      const DaysInYear = year.Year % 400 === 0 || (year.Year % 100 !== 0 && year.Year % 4 === 0);
      

      //change the value of prince in month and in year

      let NewResultInComeInMonth = ( month.FinancialIncomeMonth + ((FinancialIncomeInDay / DaysInmonth) - (PrinceBeforeUpdate.FinancialIncomeInDay  / DaysInmonth)))
      let NewResultExitnMonth = ( month.FinancialExitMonth + ((FinancialExitInDay / DaysInmonth) - (PrinceBeforeUpdate.FinancialExitInDay  / DaysInmonth)))
      console.log(PrinceBeforeUpdate.FinancialIncomeInDay)
        if (getDay) {
                month.FinancialIncomeMonth = NewResultInComeInMonth;
                month.FinancialExitMonth = NewResultExitnMonth
                month.save().then(() => {
                    if (DaysInYear) {

                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 366) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 366)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 366) - (PrinceBeforeUpdate.FinancialExitInDay  / 366)))
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { req.flash("success", " updating")
                            res.redirect("/client/funding-days/" + req.params.IdOfPage)})
                            
                        })
                    } else {
 
                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 365) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 365)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 365) - (PrinceBeforeUpdate.FinancialExitInDay  / 365)))
                       
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            console.log(year)
                            console.log("fat get day ")
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { req.flash("success", " updating")
                            res.redirect("/client/funding-days/" + req.params.IdOfPage)})
                            
                        })
                    }

                })
                
          
        }
    })
   }
} else {
    if (req.params.IdOfPage === 'null') {
        res.redirect("/client")
     } else  {
        res.redirect("/client/funding-days/" + req.params.IdOfPage)
    }
}
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {   
       res.redirect("/");
    }
   }

module.exports = client;
