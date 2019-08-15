 
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


client.post("/store-update",[
    check('Address', 'اسم المحل غير صحيح').not().isEmpty().isLength({ min: 3, max:30 }),
	check('Zone', 'المنطقة غير صحيحة').not().isEmpty().isLength({ min: 1, max:80 }),
	check('Country', 'المدينة غير صحيحة').not().isEmpty().isLength({ min: 1, max:80 }),
	check('City', 'الحي غير صحيح').not().isEmpty().isLength({ min: 1, max:80 }),
],ensureAuthenticated, async function(req, res) {  
const errors = validationResult(req);

if (!errors.isEmpty()) {
    let error = errors.array()
 
  return  res.redirect("/client/my-Compte")	
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

console.log(req.body)

 try{
   
     let client = await Client.findOne({_id: user.client})    
                          if (client.Address != req.body.Address) {
                            client.Address = req.body.Address
                          }
                          if (client.zone != req.body.Zone) {
                            client.zone = req.body.Zone
                          } 
                          if (client.country != req.body.Country) {
                            client.country = req.body.Country
                          }
                          if (client.City != req.body.City) {
                            client.City = req.body.City
                          }                              
            client.save((err, success) => {                 
                if (err) {console.log("eror")}
                else {return res.redirect("/client/my-Compte")}
               
            })

 }
catch(err) {
  console.log(err);
 }

  } else {
                
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
  

  
 
  
  client.post('/PostPicter',ensureAuthenticated, async (req, res) => {
  
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
                   
                  
                  }
                 
                })
              }
       
              client.ImageUrl = req.file.filename
              client.save((err, saved) => {
                  console.log(client)
                  if (err) {return console.log('error')}
                  else { return res.redirect("/client/my-Compte"); }
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
               
                year.month.push(newMonth._id)
                year.save().then(() => {
                    req.flash("success","تمت العملية بنجاح")
                    return res.redirect("/client/funding-month/" + req.params._id)
                })
            })
       } else {
        
            req.flash("error"," حدث خلل اثناء العملية")
            return res.redirect("/client/funding-month/" + req.params._id)
       }
   })
})

client.get("/client/funding", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
        const year = new Date().getFullYear()
        const month = new Date().getMonth() + 1
        const day = new Date().getDate()
        await Client.findOne({_id: req.user.client}).populate('year').exec((err, FundingOfYear) => {
           if (FundingOfYear) {
            return res.render("Client/Funding", {funding: FundingOfYear})
           } else {
            return res.render("Client")
           }
        })
        
       
    } else {
        return res.redirect("/direction") 
     }
})
 
client.delete("/dss", (req, res) => {
    function validateEmail(email) {
        const re = /^[0-9]$/; 
        return re.test(String(email).toLowerCase());
    }
    console.log( validateEmail(req.body.test))
})

client.post("/fundingday",[
	check('FinancialIncomeInDay', 'حدث خلل اثناء العملية').not().isEmpty().isLength({ min: 1}),	
    check('FinancialExitInDay', ' حدث خلل اثناء العملية').not().isEmpty().isLength({ min: 1}),
	
  ], ensureAuthenticated,async (req, res) => {
    const errors = validationResult(req);
    const FinancialIncomeInDay = parseFloat(req.body.FinancialIncomeInDay)
    const FinancialExitInDay = parseFloat(req.body.FinancialExitInDay)
  
	// function validateEmail(email) {
    //     const re = /^[0-9]$/; 
    //     return re.test(String(email).toLowerCase());
    // }

    if (!errors.isEmpty() || (validateEmail(req.body.email)=== false)) {
        let error = errors.array()
        req.flash("error", "errorororrroroor")
        return res.redirect("/client") }
    if (
         
       (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (typeof(FinancialIncomeInDay) === 'number') && (typeof(FinancialExitInDay) === 'number')
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
            
            async function IfExisted () {
            for  (let i = 0 ; i < client.year.length ; i++ ) {
                if (client.year[i].Year === year) {      
                    YearExist.push(client.year[i]._id)                    
                    for(let j = 0 ; j < client.year[i].month.length ; j++ ) {
                        if (client.year[i].month[j].Month === month) {
                            MonthExist.push(client.year[i].month[j]._id)                          
                            let DayId = client.year[i].month[j].day                            
                            const DayLoop = await Day.find({_id: DayId})                         
                            for(let k = 0 ; k < DayLoop.length ; k++ ) {
                              
                                if (DayLoop[k].Day === day) {                                   
                                    DayExist.push(true)                                 
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
                let newDay = new Day({
                    Day: day,
                    FinancialIncomeInDay: FinancialIncomeInDay,
                    FinancialExitInDay: FinancialExitInDay,
                 });
                 
                 newDay.save().then(() => {
                        
                    let newMonth = new Month({
                        Month: month,
                        FinancialIncomeMonth: FinancialIncomeInDay / DaysInmonth,
                        FinancialExitMonth: FinancialExitInDay / DaysInmonth,
                        day: newDay._id
                     });newMonth.save().then(() => {
                        
                         if (DaysInYear) {
                            let newYear = new Year({
                                Year: year,
                                FinancialIncomeYear: FinancialIncomeInDay / 366,
                                FinancialExitYear: FinancialExitInDay / 366,
                                month: newMonth._id
                             }); 
                             
                             newYear.save().then(() => {
                                client.year = newYear._id;
                                client.save().then(() => {
                                     req.flash("success","تمت العملية بنجاح")
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
                            
                              newYear.save().then(() => {
                               client.year = newYear._id;
                               client.save().then(() => {
                                  req.flash("success","تمت العملية بنجاح")
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
                                req.flash("success","تمت العملية بنجاح")
                                return res.redirect("/client")
                            })
                        } else {
                            let ResultInCome = lient.year[0].FinancialIncomeYear + ( FinancialIncomeInDay / 365)
                            let ResultExit = client.year[0].FinancialExitYear + (FinancialExitInDay / 365)
                            client.year[0].FinancialIncomeYear = ResultInCome
                            client.year[0].FinancialExitYear  =ResultExit
                            client.year[0].month.push(newMonth._id)
                            client.save().then(() => {
                                req.flash("success","تمت العملية بنجاح")
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
                  
                    Getmonth.FinancialIncomeMonth = ResultInCome
                    Getmonth.FinancialExitMonth =  ResultExit
                    Getmonth.day.push(newDay._id)
                    Getmonth.save().then(async() => {
                        if (DaysInYear) {
                                     
                            let Getyear = await   Year.findOne({month: Getmonth._id}) 
                            let ResultInComeYear =   Getyear.FinancialIncomeYear + (FinancialIncomeInDay / 366)
                            let ResultExitYear   =   Getyear.FinancialExitYear + (FinancialExitInDay / 366)
                               
                            Getyear.FinancialIncomeYear = ResultInComeYear
                            Getyear.FinancialExitYear = ResultExitYear
                            Getyear.save().then(() => {
                                req.flash("success","تمت العملية بنجاح")
                                return res.redirect("/client")
                            })
                            
                        } else {
                           
                           
                            let Getyear = await Year.findOne({month: Getmonth._id}) 
                            let ResultInComeYear = Getyear.FinancialIncomeYear + (FinancialIncomeInDay / 365)
                            let ResultExitYear   = Getyear.FinancialExitYear + (FinancialExitInDay / 365)
                                
                            Getyear.FinancialIncomeYear = ResultInComeYear
                            Getyear.FinancialExitYear = ResultExitYear
                            Getyear.save().then(() => {
                                req.flash("success","تمت العملية بنجاح")
                                return res.redirect("/client")
                            })
                        }
                       
                     })
                 })
             }
        })
        
        } else {
            req.flash("error"," حدث خلل اثناء العملية")
            return res.redirect("/client")
        }
  
     
   
})

client.post("/add-funding-day/:MonthId/:day", ensureAuthenticated, async (req, res) => {
    const FinancialIncomeInDay = parseFloat(req.body.FinancialIncomeInDay)
    const FinancialExitInDay = parseFloat(req.body.FinancialExitInDay)
  
    if (
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (typeof(FinancialIncomeInDay) === 'number') && (typeof(FinancialExitInDay) === 'number')
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
                            req.flash("success","تمت العملية بنجاح")
                            return  res.redirect("/client/funding-days/" +  res.params.MonthId)
                        })
                    } else {
                        let ResultIncome =  ( FinancialIncomeInDay / 365 )
                        let ResultExit =   ( FinancialExitInDay / 365 )
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            req.flash("success","تمت العملية بنجاح")
                            return  res.redirect("/client/funding-days/" +  req.params.MonthId)
                        })
                    }
                })
            }
        })    
    } else {
      req.flash("error"," حدث خلل اثناء العملية")
      return  res.redirect("/client/funding-days/" +  req.params.MonthId)
    }
 } else {
    req.flash("error"," حدث خلل اثناء العملية")
    return  res.redirect("/client/funding-days/" +  req.params.MonthId)
 }
})
client.post("/add-funding-day/:MonthId/:day/client", ensureAuthenticated, async (req, res) => {
    const FinancialIncomeInDay = parseFloat(req.body.FinancialIncomeInDay)
    const FinancialExitInDay = parseFloat(req.body.FinancialExitInDay)
  
    if (
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (typeof(FinancialIncomeInDay) === 'number') && (typeof(FinancialExitInDay) === 'number')
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
                            req.flash("success","تمت العملية بنجاح")
                            return  res.redirect("/client/funding-days/" +  res.params.MonthId)
                        })
                    } else {
                        let ResultIncome =  ( FinancialIncomeInDay / 365 )
                        let ResultExit =   ( FinancialExitInDay / 365 )
                        year.FinancialIncomeYear =  ( year.FinancialIncomeYear + ResultIncome )
                        year.FinancialExitYear = ( year.FinancialExitYear  + ResultExit)
                        year.save().then(() => {
                            req.flash("success","تمت العملية بنجاح")
                            return  res.redirect("/client" )
                        })
                    }
                })
            }
        })    
    } else {
      req.flash("error"," حدث خلل اثناء العملية")
      return  res.redirect("/client" )
    }
 } else {
    req.flash("error"," حدث خلل اثناء العملية")
    return  res.redirect("/client" )
 }
})

client.get("/client/my-compte",ensureAuthenticated,  async (req, res) => {
    if (req.user.Role === 'Client') {
    const Client = await User.findOne({_id: req.user._id}).populate({path: 'client', populate: {path: 'zone'}})
                                                          .populate({path: 'client',  populate: {path: 'country'}})
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
 
        let YearExist = []
        let MonthExist = []
        let theday = []
      const client =  await Client.findOne({_id: req.user.client}).populate({path: 'year', populate: { path: 'month'}}).exec(async(err, client) => {
          async function GetDayExist() {
            for (let i = 0 ; i < client.year.length ; i++ ) {
                if (client.year[i].Year === year) {      
                    YearExist.push(year)
                    
                    for(let j = 0 ; j < client.year[i].month.length ; j++ ) {
                        if (client.year[i].month[j].Month === month) {
                            MonthExist.push(client.year[i].month[j])
                           
                            let DayId = client.year[i].month[j].day
                            
                            const DayLoop = await Day.find({_id: DayId})
                            
                            for(let k = 0 ; k < DayLoop.length ; k++ ) {
                                if (DayLoop[k].Day === day) {
                                    const  thismonth =  await Month.findOne({_id: MonthExist[0]._id}).populate('day')
                                   
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
      await Year.findOne({_id: req.params._id}).populate('month').exec((err, YearID) => {
           if (YearID) {
            return res.render("Client/FundingMonth", {months: YearID})
           } else {
               return res.redirect('/client')
           }
      })         
           
     
       
    } else {
        return res.redirect("/direction") 
     }
})

client.get("/client/funding-days/:_id", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
     await Month.findOne({_id: req.params._id}).populate('day').exec((err, YearID) => {
         if (YearID) {
            return res.render("Client/FundingDays", {days: YearID})
         } else {
             return res.redirect('/client')
         }
     }) 
          
     
       
    } else {
        return res.redirect("/direction") 
     }
})


client.get("/client/map", ensureAuthenticated,async (req, res) => {
    if (req.user.Role === 'Client') {
       return res.render("Client/Map")
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

                    if (user.email != req.body.email) {
                        user.email = req.body.email
                    }

                   
                    user.save((err, Success) => {
                        if (Success) {
                           
                            req.flash("success", "تم تحديث البيانات بنجاح");
                           return res.redirect("/client/my-Compte"); 
                        }
                    })
   
                } else {
                    
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
                      let client = await  Client.findOne({_id: user.client}) 
                      let location = await Location.findOne({_id: client.location})
                      location.PositionLatitude = PositionLatitude
                      location.PositionLongitude  = PositionLongitude
                      location.save((err, Success) => {
                          if (Success) {
                             
                              req.flash("success", "تم تحديث البيانات بنجاح");
                              return res.redirect("/client/my-Compte"); 
                          }
                      })
     
                  } else {
                      
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
    const FinancialIncomeInDay = parseFloat(req.body.FinancialIncomeInDay)
    const FinancialExitInDay = parseFloat(req.body.FinancialExitInDay)
  
    if (
         
       (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay > -1) &&
        (FinancialIncomeInDay != null) &&
        (FinancialIncomeInDay != undefined) &&
        (typeof(FinancialIncomeInDay) === 'number') && (typeof(FinancialExitInDay) === 'number')
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
                            getDay.save().then(() => {
                                  req.flash("success","تمت العملية بنجاح")
                                  return res.redirect("/client")})
                            
                        })
                    } else {
 
                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 365) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 365)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 365) - (PrinceBeforeUpdate.FinancialExitInDay  / 365)))
                       
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { 
                                req.flash("success","تمت العملية بنجاح")
                                return  res.redirect("/client")})
                            
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
                            getDay.save().then(() => {
                                    req.flash("success","تمت العملية بنجاح")
                                    return res.redirect("/client/funding-days/" + req.params.IdOfPage)})
                                        
                        })
                    } else {
 
                        let NewResultInComeInYear = (year.FinancialIncomeYear + ((FinancialIncomeInDay / 365) - (PrinceBeforeUpdate.FinancialIncomeInDay  / 365)))
                        let NewResultExitnYear = (year.FinancialExitYear + ((FinancialExitInDay / 365) - (PrinceBeforeUpdate.FinancialExitInDay  / 365)))
                       
                        year.FinancialIncomeYear = NewResultInComeInYear
                        year.FinancialExitYear =  NewResultExitnYear
                        year.save().then(() => {
                            getDay.FinancialIncomeInDay = FinancialIncomeInDay
                            getDay.FinancialExitInDay = FinancialExitInDay;
                            getDay.save().then(() => { 
                                req.flash("success","تمت العملية بنجاح")
                                return  res.redirect("/client/funding-days/" + req.params.IdOfPage)})
                            
                        })
                    }

                })
                
          
        }
    })
   }
} else {
    if (req.params.IdOfPage === 'null') {
        req.flash("error", "حدث خلل تقني ان تكرر الخلل عليك مراسلة مطور مواقع");
        return res.redirect("/client")
     } else  {
        req.flash("error", "حدث خلل تقني ان تكرر الخلل عليك مراسلة مطور مواقع");
        return res.redirect("/client/funding-days/" + req.params.IdOfPage)
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
