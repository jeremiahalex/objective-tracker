'use strict';

//REQUIREMENTS
const express               = require('express');
const bodyParser            = require('body-parser'); 
const expressJWT            = require('express-jwt');
const jwt                   = require('jsonwebtoken');
const path                  = require('path');
const appInfo               = require('../package');
const apiRouter             = express.Router();
const usersController       = require('../controllers/users');
const lessonsController     = require('../controllers/lessons');
const objectivesController  = require('../controllers/objectives');

const jwtSecret = process.env.JWT_SECRET || "objectivestracker";

//Plug in Middleware
apiRouter.use(bodyParser.json());
apiRouter.use(bodyParser.urlencoded({extended: true}));
//TODO. use and configure helmet

//Wrapper function for restricting user access
function authorizeUser(){
  return expressJWT({secret: jwtSecret});
}

apiRouter.get('/', (req,res) => {
  res.status(200).json({ 
    name: appInfo.name, 
    version: appInfo.version,
    authorize: path.join(req.originalUrl, 'authorize'),
    lessons: path.join(req.originalUrl, 'lessons'),
    objectives: path.join(req.originalUrl, 'lessons', ':lesson_id', 'objectives')
  });
});
  
// Users Routes
apiRouter.post('/authorize', usersController.authorize);

// Lessons Routes
apiRouter.route(`/lessons`)
  .get( authorizeUser() , lessonsController.index)
//  .post(lessonsController.create);
apiRouter.route(`/lessons/:id`)
  .get(lessonsController.show)
//  .patch(lessonsController.update)
//  .put(lessonsController.update)
//  .delete(lessonsController.destroy);
//// Nested Objective Routes
//apiRouter.route(`/lessons/:id/objectives`)
////  .get(objectivesController.index)
//  .post(objectivesController.create);
//apiRouter.route(`/lessons/:lesson_id/objectives/:id`)
////  .get(objectivesController.show)
//  .patch(objectivesController.update)
//  .put(objectivesController.update)
//  .delete(objectivesController.destroy);

// catch everything else as a 404 and return error json
apiRouter.all( '/*', (req, res) => {
  res.status(404).json({message: `API endpoint not found.`});
});

//catch errors and return as json
apiRouter.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json( { 'message' : 'Token is missing or invalid' } );
  }
});

module.exports = apiRouter;