//"use strict";
//// Requirements
//const expect        = require('chai').expect;
//const supertest     = require('supertest');
//const api           = require('../../app');
//const appInfo       = require('../../package');
//const User          = require('../../models/user');
//const Lesson        = require('../../models/lesson');
//const lessonRoot    = require('../spec_helper').apiRoot + "lessons/";
//
//var userToken;
//var lessonId;
//
////LESSON
////name:             { type : String, required: true, minlength: 5 },
////goal:             { type : Number },
////status:           { type: String, enum: ["open", "closed", "hidden"] },
////dated: 		    { type: Date, default: Date.now },
////private:          { type: Boolean, default: false },
////participants:     [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
////editors:          [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
////objectives:       [Objective.schema]
//
//describe(lessonRoot, () => {
//  let newUser = {email: 'test@test.com', password: 'password', name: 'Jeremiah'};
//  let private_lesson              =  { name: 'private_lesson', goal: 5 };
//  let private_lesson_participant  =  { name: 'private_lesson_participant', goal: 5 };
//  let private_lesson_editor       =  { name: 'private_lesson_editor', goal: 5 };
//  let public_lesson               =  { name: 'public_lesson', goal: 5 };
//  let public_lesson_participant   =  { name: 'public_lesson_participant', goal: 5 };
//  let public_lesson_editor        =  { name: 'public_lesson_editor', goal: 5 };
//  let hidden_lesson               =  { name: 'hidden_lesson', goal: 5 };
//  let hidden_lesson_participant   =  { name: 'hidden_lesson_participant', goal: 5 };
//  let hidden_lesson_editor        =  { name: 'hidden_lesson_editor', goal: 5 };
//  let lessons = [private_lesson, private_lesson_participant, private_lesson_editor, public_lesson, public_lesson_participant, public_lesson_editor, hidden_lesson,
//                hidden_lesson_participant, hidden_lesson_editor];
//
//  beforeEach( (done) => {
//
//    User.create(newUser, (err, user) => {
//      if (err) return done(err);
//      userToken = user.generateToken();
//      
//      Lesson.create(lessons, (err) => {
//        if (err) return done(err);
//        //all additional params come in as arguments so we can get all of the created lessons from elem 1 onwards
//        for ( var i = 1; i < arguments.length; i++) {
//          lessons[i-1].id = arguments[i].id;
//        }
//      });
//      
//    });
//
//  });
//
//  // list: returns all lessons that the user is an editor on; and where they are a participant and lesson is not hidden 
//  describe('GET /', () => {
//    it('responds 200 with an array', (done) => {
//      supertest(api)
//        .get(lessonRoot)
//        .set('Accept', 'application/json')
//        .set('Authorization', `Bearer ${userToken}`)
//        .expect('Content-Type', /json/)
//        .expect(200)
//        .end((err, res) => {
//          if (err) return done(err); 
//          expect(res.body.lessons).to.be.instanceof(Array);
//          expect(res.body.lessons.length).to.equal(1);
//          done();
//        });
//    });
//
//    it('responds 401 if invalid token', (done) => {
//      supertest(api)
//        .get(lessonRoot)
//        .set('Accept', 'application/json')
//        .set('Authorization', `Bearer: 1234567890`)
//        .expect('Content-Type', /json/)
//        .expect(401)
//        .end((err, res) => {
//          if (err) return done(err); 
//          expect(res.body.lessons).to.be.an('undefined');
//          done();
//        });
//    });
//
//  });
//
//  // show: returns the lesson with id unless it is not found or it is private and the user is not a participant or it is
//  describe('GET /:id', () => {
//    it('responds 200 with an specific lesson', (done) => {
//      supertest(api)
//        .get(lessonRoot + lessonId)
//        .set('Accept', 'application/json')
//        .set('Authorization', `Bearer ${userToken}`)
//        .expect('Content-Type', /json/)
//        .expect(200)
//        .end((err, res) => {
//          if (err) return done(err); 
//          expect(res.body.lesson.id).to.equal(lessonId);
//          done();
//        });
//    });
//
//    it('responds 404 when lesson not found', (done) => {
//      supertest(api)
//        .get(lessonRoot + "1234")
//        .set('Accept', 'application/json')
//        .set('Authorization', `Bearer ${userToken}`)
//        .expect('Content-Type', /json/)
//        .expect(404)
//        .end((err, res) => {
//          if (err) return done(err); 
//          expect(res.body.lesson).to.be.an('undefined');
//          done();
//        });
//    });
//  });
//
//});