'use strict';

const MIN_PASSWORD = 8;
const MIN_NAME = 2;
const TOKEN_VALIDITY = '24h';

const mongoose              = require('mongoose');
const bcrypt                = require('bcrypt');
const expressJWT            = require('express-jwt');
const jwt                   = require('jsonwebtoken');
const debug                 = require('debug')('model');
const jwtSecret             = process.env.JWT_SECRET || "objectivestracker";

const UserSchema = mongoose.Schema({
  name          : { type : String, required: true, minlength: MIN_NAME },
  email         : { type : String, required: true, unique: true },
  password      : { type : String, required: true, minlength: MIN_PASSWORD }
});

UserSchema.set('toJSON', {
  transform: function(doc, ret, options) {
    return {
        id: ret._id,
        name: ret.name,
        email: ret.email
    };
  }
});

UserSchema.methods.authenticate = function(password, callback){
  const user = this;
  
  bcrypt.compare(password, user.password, function(err,isMatch){
    callback(err,isMatch);
  });
};

//we generate a object with user info and sign it with jwt
UserSchema.methods.generateToken = function(){
    let tokenInfo = {
      name: this.name,
      id: this.id
    };
    return jwt.sign(tokenInfo, jwtSecret, { expiresIn: TOKEN_VALIDITY });
};

//Stub logout function, not currently needed as we're not using sessions
UserSchema.methods.logout = function(){
};

UserSchema.pre('save', function(next){
  const user = this;
  
  //if password has changed then we hash it
  if (!user.isModified('password')) return next();
  
  //Simple password length validation
  if (user.password.length < MIN_PASSWORD) {
    user.invalidate("password", `password must be atleast ${MIN_PASSWORD} characters`);
    return next();
  }
  
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    
    bcrypt.hash(user.password, salt, (err,hash) => {
      if (err) return next(err);
      
      user.password = hash;
      next();
    });
  });
});


module.exports = mongoose.model('User', UserSchema);