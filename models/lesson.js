'use strict';

const mongoose    = require('mongoose');
const Objective   = require("./objective");

const LessonSchema = mongoose.Schema({
  name:             { type : String, required: true, minlength: 5 },
  goal:             { type : Number },
  status:           { type: String, enum: ["open", "closed", "hidden"], default: "open" },
  dated: 		    { type: Date, default: Date.now },
  private:          { type: Boolean, default: false },
  participants:     [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  editors:          [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  objectives:       [Objective.schema]
});

//If no responsersGoal then use the length of participants
LessonSchema.methods.responseGoal = function(){
  return this.goal || this.participants.length || 0;
};

LessonSchema.set('toJSON', {
    transform: function(doc, ret, options) {
        return {
            id: ret._id,
            name: ret.name,
            goal: ret.goal,
            status: ret.status,
            dated: ret.dated,
            private: ret.private,
            participants: ret.participants,
            editors: ret.editors,
            objectives: ret.objectives,
        };
    }
});

module.exports = mongoose.model('Lesson', LessonSchema);