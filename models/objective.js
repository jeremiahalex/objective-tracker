'use strict';

const mongoose    = require('mongoose');

const ObjectiveSchema = mongoose.Schema({
  name:             { type : String, required: true, minlength: 5 },
  responders:       [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  confusions:       [{ type : String }]
});

ObjectiveSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            responders: ret.responders,
            confusions: ret.confusions
        };
    }
});

module.exports = mongoose.model('Objective', ObjectiveSchema);