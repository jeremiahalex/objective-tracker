'use strict';

const User          = require('../models/user');
const Util          = require('../lib/utils');
const debug         = require('debug')('controller');

// POST /authorize -- A single function that acts as both a login and register
function authorize(req, res) {
    
    // Extract the allowed params
    const userParams = {
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    };
    if (!userParams.email || !userParams.password) return res.status(422).json({message: "Invalid Data"});
  
    // attempt to find user by email and login or create depending on result
    User.findOne({email: userParams.email}, (err,user) => {
      if (user){
        //login
        user.authenticate(userParams.password, (err, isMatch) => {
          if (err) throw err;

          if (!isMatch) return res.status(401).json( {message: "Authorization Failed."});

          res.status(200).json( { user: user, token: user.generateToken() });
        });
      } else {
        //no user then we register instead
        user = new User( userParams );
        
        user.save((err, user) =>{
          if (err) return res.status(422).json({errors: Util.mongooseErrMessages(err)});
          
          res.status(201).json( {user: user, token: user.generateToken() });
        });
      }
  });
}
// GET /logout
function logout(req, res) {
  if ( req.user ){
    User.findById(req.user.id, (err, user) => {
      if (err) return res.status(422).json({message: err.errmsg});
      if (user){
        user.logout();
      }
      res.status(200).json( {message: "Logged Out" });
    });
  } else {
    //If we can't find a user then that is fine as that is the same as being logged out
    res.status(200).json( {message: "Logged Out" });
  }
}

// GET /users
function list(req, res) {
  User.find((err, users) => {
      res.status(200).json( {users: users });
  });
}


// GET /users/:id
function show(req, res) {
  User.findById(req.params.id, (err, user) => {
      res.status(200).json( {user: user });
  });
}

module.exports = {
  authorize:  authorize,
  logout:     logout,
  list:       list,
  show:       show
};