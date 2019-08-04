const express = require("express");
const auth = express.Router();
const passport = require("passport");
const User = require("../../models/user");
const Client = require("../../models/client");
const Location = require("../../models/location");
const Evaluation = require("../../models/evaluation");
const City = require("../../models/city");
const Country = require("../../models/country");
const Zone = require("../../models/zone");
const session = require('express-session');
const async =  require("async");
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const validator = require('validator');
auth.use(session({ cookie: { maxAge: 60000 }, 
    secret: 'woot',
    resave: false, 
    saveUninitialized: false}));

auth.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.errors = req.flash("error");
	  res.locals.infos = req.flash("info");
	  res.locals.success = req.flash("success");
    next();
   })
   
auth.get('/login', (req, res ) => {

    res.render("Authentification/SignIn")
})

auth.get('/forgot', (req, res ) => {

    res.render("Authentification/ForgotPassword")
})

auth.get('/signup', async (req,res )=> {
	 const count = await User.countDocuments({})
	 const zone = await Zone.find({})
	 if (count === 0) {
		res.render("Authentification/SignUpAdmin",{zone: zone})
	 } else {
		res.render("Authentification/SignUp",{zone: zone})
	 }
    
})


// auth.get('/routes', (req,res )=> {
// 	res.render("Authentification/SignUp")
// })
 

auth.post("/signupadmin", async function(req, res) {
	
	var email = req.body.email;
	User.findOne({ email: email }, function(err, user) {
	if (err) { return next(err); }
	if (user) {
	req.flash("error", "هذا البريد مسجل من قبل  ");
	return res.redirect("/signup");
	}
	let newUser = new User({
		Fullname: req.body.Fullname,		
		email: email,		
		Role: "Admin",			
		user: req.body.username,
		password: req.body.Password, 
	});console.log(newUser)
		newUser.save({},function(err, success){
			if (err) { console.log( " ERROR ")}
			if (success) {
				console.log("No error ")
				res.redirect("/login")
			 } 
		});

    });
		

 },passport.authenticate("login", {
	 
	successRedirect: "/routes",
	failureRedirect: "/signup",
	failureFlash: true
 }));

//his req for signup
auth.post("/signup", async function(req, res) {
	
	var email = req.body.email;
	User.findOne({ email: email },async function(err, user) {
		console.log(user)
	if (err) { return next(err); }
	if (user) {
	req.flash("error", "هذا البريد مسجل من قبل  ");
	return res.redirect("/signup");
	}

	async function  getIdInformation () {
		return new Promise(function(resolve, reject) {
  const arrayId = []
      if ((req.body.valuecheckboxzone === 'on') && 
	  (req.body.valuecheckboxcountry === undefined) &&
	  (req.body.valuecheckboxcountry === undefined))  {
	 
		
		 
         let newCity =  new City({
			 City: req.body.newCity
		 });newCity.save().then(() => {
	 
			 let newCountry = new Country({
				 Country: req.body.newCountry,
				  city:  newCity._id 
			 });newCountry.save().then(() => {
			   console.log(newCountry)
				let newZone = new Zone({
					Zone: req.body.newZone,
					country:  newCountry._id 
				});newZone.save().then(() => {
					console.log("3")
					arrayId.push(newZone._id, newCountry._id, newCity._id)
				
					resolve(arrayId)
				   
				})
			 })
		 })
	} else if ((req.body.valuecheckboxzone === undefined) && 
				(req.body.valuecheckboxcountry === 'on') &&
				(req.body.valuecheckboxcity ===  undefined)) {
				 console.log("1111")
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

	} else if ((req.body.valuecheckboxzone === undefined) && 
			   (req.body.valuecheckboxcountry === undefined) &&
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


	const Lat = parseFloat(req.body.PositionLatitude)
	const Lng = parseFloat(req.body.PositionLongitude)
	let newLocation = new Location({
		PositionLatitude: Lat,
		PositionLongitude: Lng,
	});newLocation.save().then(() => {
	 
								let newClient = new Client({
								Address: req.body.Address,
								zone: ArrayId[0],
								country: ArrayId[1],
								city: ArrayId[2],
								Phone: req.body.Phone,
								location: newLocation._id,
				});newClient.save().then(() => {

            newLocation.client = newClient._id;
						 newLocation.save().then(() => { 
               	let newUser = new User({
									Fullname: req.body.Fullname,									
									email: email,		
									Role: "Client",						
									user: req.body.username,
									client:  newClient._id,
						    	password: req.body.Password, 
				    	}); 
						 		newUser.save((err, success) => {
								if (err) {console.log("eror")}
                else {return res.redirect("/login")}
							  
							})

          })
         })


       
    }) 
     }
    catch(err) {
      console.log(err);
     }
 }
 CreateNewUser()


  });




 },passport.authenticate("login", { 
	successRedirect: "/direction",
	failureRedirect: "/login",
	failureFlash: true
 }));




auth.get("/logout", function(req, res) {

	req.logout();
	res.redirect("/");
 });





auth.post('/forgot', function(req, res, next) {
	async.waterfall([
	  function(done) {
		crypto.randomBytes(20, function(err, buf) {
		  var token = buf.toString('hex');
		  done(err, token);
		});
	  },
	  function(token, done) {
		User.findOne({ email: req.body.email }, function(err, user) {
		  if (!user) {
			req.flash('error', 'لا يوجد حساب يهذا البريد الإلكتروني  ');
			return res.redirect('/forgot');
		  }
  
		  user.ResetPasswordToken = token;
		  user.ResetPasswordExpires = Date.now() + 3600000; // 1 hour
  
		  user.save(function(err) {
			done(err, token, user);
		  });
		});
	  },
	  function(token, user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail',
		  auth: {
			user: 'washpolishcar@gmail.com',
			pass: 'Jesuisderetour_1'
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'washpolishcar@gmail.com',
		  subject: 'استرجاع الحساب',
		  text: 'أنت تتلقى هذا لأنك (أو شخصًا آخر) طلب إعادة تعيين كلمة المرور لحسابك.\n\n' +
			'الرجاء النقر فوق الرابط التالي  لإكمال العملية:\n\n' +
			'http://' + req.headers.host + '/reset/' + token + '\n\n' +
			'إذا لم تطلب ذلك ، فيرجى تجاهل هذا البريد الإلكتروني وستظل كلمة المرور الخاصة بك دون تغيير.\n'
		};
		smtpTransport.sendMail(mailOptions, function(err) {
		  req.flash('info', 'تم إرسال رسالة إلكترونية إلى ' + user.email + ' مع مزيد من التعليمات.');
		  done(err, 'done');
		});
	  }
	], function(err) {
	  if (err) return next(err);
	  res.redirect('/forgot');
	});
  });

  // the route for reset the password
auth.get('/reset/:token', function(req, res) {
	User.findOne({ ResetPasswordToken: req.params.token, ResetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
	  if (!user) {
		req.flash('error', 'رمز إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته.');
		return res.redirect('/forgot');
	  }
	  res.render('Authentification/ResetPassword', {token: req.params.token
	  });
	});
  });
auth.post('/reset/:token', function(req, res) {
	async.waterfall([
	  function(done) {
		User.findOne({ ResetPasswordToken: req.params.token, ResetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
		  if (!user) {
			req.flash('error', 'رمز إعادة تعيين كلمة المرور غير صالح أو انتهت صلاحيته.');
			return res.redirect('back');
		  }
          console.log(req.body.password)

		  user.password = req.body.password;
		  user.ResetPasswordToken = undefined;
		  user.ResetPasswordExpires = undefined;
         		  user.save(function(err) {
			req.logIn(user, function(err) {
			  done(err, user);
			});
		  });
		});
	  },
	  function(user, done) {
		var smtpTransport = nodemailer.createTransport({
		  service: 'Gmail',
		  auth: {
			user: 'washpolishcar@gmail.com',
			pass: 'Jesuisderetour_1'
		  }
		});
		var mailOptions = {
		  to: user.email,
		  from: 'washpolishcar@gmail.com',
		  subject: 'تم تغيير كلمة السر الخاصة بك',
		  text: 'مرحبا,\n\n' +
			'  ' + user.email + '\n هذه الرسالة لتاكيد على أن كلمة المرور لحسابك تم تغييرها .\n'
		}; 
		smtpTransport.sendMail(mailOptions, function(err) {
		  req.flash('success', '  تغيير كلمة السر الخاصة بك ينجاح.');
		  res.redirect('/login');
		  done(err);
		});
	  }
	], function(err) {
	  res.redirect('/');
	});
	});

module.exports = auth;
