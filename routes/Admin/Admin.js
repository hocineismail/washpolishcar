const express = require("express");
const admin = express.Router();
const async =  require("async");
// const multer = require('multer');
const bodyParser = require("body-parser");
const path = require("path");
const User = require("../../models/user")
const Client = require("../../models/client");
const Location = require("../../models/location");
const Visitor =  require("../../models/visitor")
const generator = require('generate-password');
const Zone =  require("../../models/zone")
const Country =  require("../../models/country")
const City =  require("../../models/city")
const nodemailer = require('nodemailer');
const {check, validationResult} = require('express-validator/check');
admin.post("/update-zone/:_id",ensureAuthenticated , async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
     await Zone.findOne({_id: req.params._id}).exec((err, zone) => {
        if (zone) {
            zone.Zone = req.body.Zone
            zone.save().then(() => {
                req.flash("success"," تم التعديل ")
                return res.redirect("/admin-panel/zone")
            })
           
        } else {
            req.flash("error"," حدث خلل اثناءالعملية ")
            return res.redirect("/admin-panel/zone")
        }
    })
 

} else {  return res.redirect("/direction") }

})

admin.post("/add-zone",ensureAuthenticated , async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
       let newZone = new Zone({
          Zone: req.body.Zone
       });newZone.save().then(() => {
            req.flash("success"," تم اضافة المنطقة ")
            return res.redirect("/admin-panel/zone")
        })
       
    } else {  return res.redirect("/direction") }
})

admin.get("/delete-zone/:_id",ensureAuthenticated , async(req, res) => {

    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {  
  await Zone.findOneAndRemove({_id: req.params._id},async (err, zone) => {
      if (err) {
            req.flash("error", "الرابط غير موجود ربما يكون قد حذف");
            return res.redirect('/admin-panel/zone')
        }
        if (!err)  {
            console.log("done")
            console.log(zone)
            for (let i = 0 ; i < zone.country.length; i++) {
                Country.findOneAndRemove({_id: zone.country[i]}, (err, country) => { 
                   if (country) {
                    console.log("done")
                    for (let j = 0 ; j < country.city.length; j++) {
                        City.findOneAndRemove({_id: country.city[j]},async (err, city) => { 
                           if (city) {
                           
                               console.log(city)
                           }  
                         
                        })
                    } 
                   }  
                 
                })
            } 
            
        }
    }).then(() => {
        return res.redirect('/admin-panel/zone')
    })

} else {  return res.redirect("/direction") }
})

admin.get("/delete-country/:_id/:page",ensureAuthenticated , async(req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {  
    await Country.findOneAndRemove({_id: req.params._id},async (err, country) => {
          if (err) {
            req.flash("error", "الرابط غير موجود ربما يكون قد حذف");
            return res.redirect('/admin-panel/country/'+ req.params.page)
          }
          if (!err)  {
              console.log("done")
              console.log(country)
              for (let i = 0 ; i < country.city.length; i++) {
                  City.findOneAndRemove({_id: country.city[i]}, (err, city) => { 
                     if (city) {
                      console.log("done")
                    
                     }  
                   
                  })
              } 
              
          }
      }).then(() => {
          return res.redirect('/admin-panel/country/'+ req.params.page)
      })

    } else {  return res.redirect("/direction") }
  })

admin.get("/delete-city/:_id/:page",ensureAuthenticated , async(req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {   
    
    
     await City.findOneAndRemove({_id: req.params._id}, (err, city) => { 
         if (err) {
            req.flash("error", "الرابط غير موجود ربما يكون قد حذف");
            return res.redirect('/admin-panel/city/'+ req.params.page)
         }
      if (city) {
        console.log("done")
                    
         }  
                  
      }).then(() => {
          return res.redirect('/admin-panel/city/'+ req.params.page)
      })

    } else {  return res.redirect("/direction") }
  })

admin.post("/update-country/:_id/:page",ensureAuthenticated , async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {   
    await Country.findOne({_id: req.params._id}).exec((err, country) => {
        if (country ) {
            country.Country = req.body.Country
            country.save().then(() => {
                req.flash("success"," تم التعديل ")
                return res.redirect("/admin-panel/country/"+ req.params.page)
            })
           
        } else {
            req.flash("error"," حدث خلل اثناءالعملية ")
            return res.redirect("/admin-panel/country/"+ req.params.page)
        }
    })
 
} else {  return res.redirect("/direction") }
})


admin.post("/add-country/:_id",ensureAuthenticated , async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {  
    await Zone.findOne({_id: req.params._id}).exec((err, zone) => {
    if (!zone) {
        req.flash("error"," حدث خلل اثناءالعملية ")
        return res.redirect("/admin-panel/country/"+ req.params._id)
       }
        let newCountry = new Country({
           Country: req.body.Country
        });newCountry.save().then(() => {
             zone.country.push(newCountry._id)
             zone.save().then(() => {
                req.flash("success"," تم اضافة المنطقة ")
                return res.redirect("/admin-panel/country/"+ req.params._id)
             })
            
         })
  })

    } else {  return res.redirect("/direction") }

})


admin.get("/admin-panel/zone",ensureAuthenticated ,async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {  
const zone = await Zone.find({})
  res.render("Admin/zone", {zone: zone})

} else {  return res.redirect("/direction") }
})

admin.get("/admin-panel/country/:_id",ensureAuthenticated ,async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {  
      await Zone.findOne({_id: req.params._id}).populate('country').exec((err, country) => {
        if (!country) {
            req.flash("error", "الرابط غير موجود ربما يكون قد حذف");
            return res.redirect('/admin-panel/zone')
         }
          res.render("Admin/country", {country: country})
    })

    } else {  return res.redirect("/direction") }
    })

admin.get("/admin-panel/city/:_id",ensureAuthenticated , async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {   
     await Country.findOne({_id: req.params._id}).populate('city').exec((err ,city) => {
        if (!city) {
            req.flash("error", "الرابط غير موجود ربما يكون قد حذف");
            return res.redirect('/admin-panel/zone')
        }
        res.render("Admin/city", {city: city})
    })
    
} else {  return res.redirect("/direction") }
})

admin.post("/signup-new-admin",[
	check('email', ' حلل في البريد').not().isEmpty().isLength({ min: 1, max:50 }),
	check('Fullname', 'حلل في الاسم').not().isEmpty().isLength({ min: 1, max:50 }),
  ], ensureAuthenticated, async function(req, res) {  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
 
		req.flash("error","خلل في ادخال البيانات  البريد او الاسم غير صحيح")	
	    return res.redirect("/admin-panel/signupadmin");	
	  } else {
    if ((req.user.Role === 'Admin') ) {
        User.findOne({_id: req.user._id}, (err, usercurrent) => { 
  
            usercurrent.checkPassword(req.body.Password,async function(err, isMatch) {
                
                if (!isMatch) { 
               
                    req.flash("error", "كلمة المرور غير صحيحة");
                    return res.redirect("/admin-panel/signupadmin"); 
                }
                    if (isMatch) {
                        console.log("wec ")
                        var email = req.body.email;
                        User.findOne({ email: email }, function(err, user) {
                            console.log(user)
                        if (err) { return next(err); }
                        if (user) {
                        req.flash("error", "هذا البريد مسجل من قبل  ");
                        return res.redirect("/admin-panel/signupadmin");
                        }
                        const password = generator.generate({
                            length: 10,
                            numbers: true
                        });
                        console.log(password)
                        let newUser = new User({
                            Fullname: req.body.Fullname,
                            email: email,		
                            Role: "under-Admin",			
                            user:  email,
                            password: password, 
                        });console.log(newUser)
                        
                            newUser.save({},function(err, success){
                                
                                if (err) { console.log( " ERROR ")}
                                if (success) {
                    
                                        nodemailer.createTransport({
                                            service: 'Gmail',
                                            auth: {
                                              user: 'washpolishcar@gmail.com',
                                              pass: 'Jesuisderetour_1'
                                            }
                                          }).sendMail( {
                                            to:  email,
                                            from: 'washpolishcar@gmail.com',
                                            subject: 'انت الان مدير لفريقنا washpolishcar',
                                            text: 'مرحبا,\n\n' +
                                              '  ' + '\n email:  '+ email + '\n password:  ' +  password + '\n هذه الرسالة لتاكيد على ان حسبابك تم فتحه و تم تعيين كلمة المرور تلقائيا     .\n' 
                                            
                                             
                                          }  ,function(err, sending) {
                                            if (err) {
                                                req.flash("error","خلل في ادخال البيانات  البريد او الاسم غير صحيح")	
                                                return res.redirect("/admin-panel/signupadmin");
                                            }
                                            if (sending) {
                                            req.flash("success","  نم نسجيل ادمين و تم ارسال رسالة الى بريده تحتوي على كلمة مروره تم قنح حساب ")
                                            return res.redirect("/admin-panel/signupadmin")
                                            }
                                        } )
                                }  
                            }) 
                    
                     });
                     } })   
                    }) 
                        
	

        
    } else {
        return res.redirect("/direction")
    } 
} 
})


admin.get("/admin-panel", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
        const visitor = await Visitor.find({})
        const clients = await Client.count()
        console.log(clients)
        if (visitor) {
            return res.render("Admin/AdminPanel", {visitor: visitor,client: clients})
        } else {
            Isvisitor = []
            return res.render("Admin/AdminPanel", {visitor: Isvisitor,client: clients})
        }
        
    } else {
        return res.redirect("/direction")
    }
})

admin.get("/admin-panel/map", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
    const clients = await Client.find({}).populate('location')
    const PositionCurrently = await User.findOne({_id: req.user._id}).populate({path: 'client', populate: { path: 'location' }})
    console.log(PositionCurrently)
   return res.render("Admin/Map", {clients: clients, PositionCurrently: PositionCurrently})
      
} else {
    return res.redirect("/direction")
}
 
})


admin.get("/admin-panel/signupadmin", ensureAuthenticated, async (req, res) => {

    res.render("Admin/signup")
        
})



admin.get("/admin-panel/List-Users", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
      User.find({Role: 'Client'}).populate({path: 'client', populate: {path: 'zone'}})
                                  .populate({path: 'client', populate: {path: 'country'}})
                                  .populate({path: 'client', populate: {path: 'city'}})
                                  .exec((err, users) => {
        if(users) {
            return res.render("Admin/Listusers",{users: users})
        } else {
            req.flash("error", "حدث خلل تقني ان تكرر الخلل عليك مراسلة مطور مواقع");
            return res.redirect("Admin/AdminPanel")
        }
       
      })
    } else {
        return res.redirect("/direction")
}
   
        
})



admin.get("/admin-panel/List-Admins", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
      User.find({ $or:[  {Role: 'Admin'}, {Role: 'under-Admin'} ]}).exec((err, users) => {
        if(users) {
            console.log(users)
            return res.render("Admin/listAdmins",{users: users})
        } else {
            req.flash("error", "حدث خلل تقني ان تكرر الخلل عليك مراسلة مطور مواقع");
            return res.redirect("Admin/AdminPanel")
        }
       
      })
    } else {
        return res.redirect("/direction")
}
   
        
})

admin.get("/admin-panel/My-Compte", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
       return res.render("Admin/AdminMyCompte")
    } else {
        return res.redirect("/direction")
    }
})


//uPDATIN COMPTE
admin.get("/admin-panel/delete/:_id", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
    User.findOneAndDelete({_id: req.params._id},(err, user)=> {
        if (err) { 
          req.flash("error", "حدث خلل اثناء العملية ");
          return   res.redirect("/admin-panel/List-Users")
        
        } else {
            if (user.Role === 'Client') {
                Client.findOneAndDelete({_id: user.client}, (err, client) => {
                    if (client) {
                       Location.findByIdAndDelete({_id: client.location._id} , (err, location) => {
                         req.flash("error", "قد تم حذف  الحساب ");
                         return   res.redirect("/admin-panel/List-Users")
                       }) 
                    }
                 })

             } else {
                req.flash("error", "قد تم حذف  الحساب ");
                return   res.redirect("/admin-panel/List-Admins")
             }

            
        }
     
        
})
    } else {
          return res.redirect("/direction")
    }
})


admin.post("/compte-admin-update",[
	check('Fullname', 'اسم حاحب المحل غير صحيح').not().isEmpty().isLength({ min: 3, max:30 }),    
	check('Email', 'حلل في البريد').not().isEmpty(),

	
	
  ], async function(req, res) {  
    const errors = validationResult(req);
    

    User.findOne({_id: req.user._id}, (err, user) => {
        user.checkPassword(req.body.Password,async function(err, isMatch) {
            if (err) { 
                req.flash("error", "حدث خلل تقني انن تكرر الخلل عليك مراسلة مطور مواقع");
                return res.redirect("/client/my-Compte"); 
            }
                if (isMatch) { 
                   
                     
                    user.email = req.body.Email
                    user.Fullname = req.body.Fullname
                    user.save((err, Success) => {
                        if (Success) {
                            console.log(user)
                            req.flash("success", "تم تحديث البيانات بنجاح");
                            return res.redirect("/admin-panel/My-Compte"); 
                        }
                    })
   
                } else {
                    console.log('probeleme de password')
                    req.flash('error', 'لم يم تحديث  البيانات بسبب عدم ادخال كلمة المرور الصحيحة');
                    return res.redirect('/admin-panel/My-Compte'); 
            }
            });   
       })
})
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    next();
    } else {
   
    res.redirect("/");
    }
   }
         
module.exports = admin;