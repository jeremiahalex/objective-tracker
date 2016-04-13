'use strict';

// Requirements
const app           = require('./app.js'); 
const port          = process.env.PORT || 3000;
const mongoose      = require('mongoose');
const debug         = require('debug')('server');

// Connect to db
mongoose.connect( process.env.DATABASE_URL || 'mongodb://localhost:27017/objective-tracker' );

// Fire up our server
app.listen(port, () => {
  debug(`Server Listening on port ${port}`);
});
