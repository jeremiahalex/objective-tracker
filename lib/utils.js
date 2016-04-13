'use strict';

const mongooseValidations = {
    'required': "can not be blank.",
    'min': "is less than minimum.",
    'max': "exceeds maximum.",
    'enum': "is not a valid value."
};

// Helper function to provide more human versions of mongoose validation errors
function mongooseErrMessages(err){
  if (err.name !== 'ValidationError') return ["unspecified validation error"];
  
  let errorMsgs = [];
  
  for (let key in err.errors) {
    let value = `${err.errors[key].path} ${mongooseValidations[err.errors[key].kind]}`;
    errorMsgs.push(value);
  }
  return errorMsgs;
}

module.exports = {
  mongooseErrMessages: mongooseErrMessages
};