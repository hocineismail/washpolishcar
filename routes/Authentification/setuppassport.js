const passport = require("passport");
const User = require("../../models/user");
const LocalStrategy = require("passport-local").Strategy;
module.exports = function() {
 passport.serializeUser(function(user, done) {
 done(null, user._id);
 });
 passport.deserializeUser(function(id, done) {
 User.findById(id, function(err, user) {
 done(err, user);
 });
 });
};


     passport.use("login", new LocalStrategy(
     function(email, password, done) {
            
     User.findOne({ email: email }, function(err, user) {
     if (err) { return done(err); } 
         if (!user) {
           return done(null, false,
         { message: "هذا حساب غير مسجل" });
         }


     user.checkPassword(password, function(err, isMatch) {
     if (err) { return done(err); }
         if (isMatch) {
          
         return done(null, user);
         } else {
         return done(null, false,
         { message: " كلمة المرور غير صحيحة." });
     }
     });
     });
   }));
