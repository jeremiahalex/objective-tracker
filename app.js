'use strict';

// REQUIREMENTS
const express       = require('express');           //express as our web server
const morgan        = require('morgan');
const pathfinderUI  = require('pathfinder-ui');     //dev dependency TODO. remove
const app           = express();
// local requirements
const routes        = require('./config/routes');   //our route definitions
const debug         = require('debug')('server');

debug('booting app');
//Setup
app.set('view engine', 'ejs');

// Middleware      
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}
app.use('/routes', function(req, res, next){
    pathfinderUI(app);
    next();
}, pathfinderUI.router);
  
// Plug in api routes
app.use('/api', routes);

//server everything in client as static pages
app.use(express.static('client'));

// Development Errors
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// Production error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//export app so we can use in testing
module.exports = app;