"use strict";

//This file will run first as it is the only file in the directory. Recurssiveness will kick in afterwards.
const http          = require('http');
const api           = require('../app');
const mongoose      = require('mongoose');
const server        = http.createServer(api);

//start the server before the test suite runs
before( (done) => {
  server.listen(()=>{
    console.log('server listening on port: ', server.address().port);
    done();
  });
});

//clear the database between each test
beforeEach(function (done) {
  function clearDB() {
    mongoose.connection.db.dropDatabase(()=>{
        done();
    });
  }

  if (mongoose.connection.readyState === 0) {
    mongoose.connect( process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/objective-tracker-test', (err) => {
      if (err) throw err;
      clearDB();
    });
  } else {
    clearDB();
  }
});
    