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
 
const nodemailer = require('nodemailer');

admin.post("/signup-new-admin", ensureAuthenticated, async (req, res) => {
  
    if ((req.user.Role === 'Admin') ) {
          	
	var email = req.body.email;
	User.findOne({ email: email }, function(err, user) {
		console.log(user)
	if (err) { return next(err); }
	if (user) {
	req.flash("error", "هذا البريد مسجل من قبل  ");
	return res.redirect("/signup");
	}
    const password = generator.generate({
        length: 10,
        numbers: true
    });
    console.log(password)
	let newUser = new User({
		Firstname: req.body.Firstname,
		Lastname: req.body.Lastname,
		email: email,		
		Role: "under-Admin",			
		user:  email,
		password: password, 
    });console.log(newUser)
    
		newUser.save({},function(err, success){
            
			if (err) { console.log( " ERROR ")}
			if (success) {
                
                    // var smtpTransport = nodemailer.createTransport({
                    //   service: 'Gmail',
                    //   auth: {
                    //     user: 'washpolishcar@gmail.com',
                    //     pass: 'Jesuisderetour_1'
                    //   }
                    // });
                    // var mailOptions = {
                    //   to:  email,
                    //   from: 'washpolishcar@gmail.com',
                    //   subject: 'تم تغيير كلمة السر الخاصة بك',
                    //   text: 'مرحبا,\n\n' +
                    //     '  ' +  email + '\n هذه الرسالة لتاكيد على أن كلمة المرور لحسابك تم تغييرها .\n' 
                      
                       
                    // } 
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
                          '  ' + '\n email:  '+ email + '\n password:  ' +  password + '\n هذه الرسالة لتاكيد على أن كلمة المرور لحسابك   .\n' 
                        
                         
                      }  ,function(err, sending) {
                        if (err) {console.log('errrorororoorrorororooror')}
                        if (sending) {
                            console.log(sending)
                        return res.redirect("/admin-panel/signupadmin")
                        }
                    } )
            }  
		}) 

 });

        
    } else {
        return res.redirect("/direction")
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
        return req.redirect("/direction")
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
        return req.redirect("/direction")
}
   
        
})

admin.get("/admin-panel/My-Compte", ensureAuthenticated, async (req, res) => {
    if ((req.user.Role === 'Admin') || (req.user.Role === 'under-Admin')) {
       return res.render("Admin/AdminMyCompte")
    } else {
        return req.redirect("/direction")
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
          return req.redirect("/direction")
    }
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    next();
    } else {
   
    res.redirect("/");
    }
   }
         
module.exports = admin;