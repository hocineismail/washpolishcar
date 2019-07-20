const bcrypt = require("bcrypt-nodejs");
const mongoose = require("mongoose");
const SALT_FACTOR = 10; 
const Schema = mongoose.Schema
const userSchema = mongoose.Schema({
    Firstname: {type: String, },
    Lastname: {type: String, },
    Birthday: {type: Date},
    Sex: {type: String  },
    user: { type: String,  unique: true },
    email: { type: String,  unique: true },
    password: { type: String,  },
    ResetPasswordToken: String,
    ResetPasswordExpires: Date,
    CreatedAt: { type: Date, default: Date.now },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
      },
    visiteur: {
        type: Schema.Types.ObjectId,
        ref: 'Visiteur'
    }  
});
var noop = function() {};
userSchema.pre("save", function(done) {
 var user = this;
 if (!user.isModified("password")) {
 return done();
 }
 bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
 if (err) { return done(err); }
 bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
 if (err) { return done(err); }
 user.password = hashedPassword;
 done();
 });
 });
});
userSchema.pre("update", function(done) {
     var user = this;
     if (!user.isModified("password")) {
     return done();
     }
     bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
     if (err) { return done(err); }
     bcrypt.hash(user.password, salt, noop, function(err, hashedPassword) {
     if (err) { return done(err); }
     user.password = hashedPassword;
     done();
     });
     });
    });

userSchema.methods.checkPassword = function(guess, done) {
    bcrypt.compare(guess, this.password, function(err, isMatch) {
    done(err, isMatch);
    });
   };
   userSchema.methods.name = function() {
    return this.displayName || this.email;
   };

   var User = mongoose.model("User", userSchema);
module.exports = User;
