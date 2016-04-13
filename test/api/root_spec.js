"use strict";

// Requirements
const expect        = require('chai').expect;
const supertest     = require('supertest');
const api           = require('../../app');
const appInfo       = require('../../package');
const User          = require('../../models/user');
const apiRoot       = require('../spec_helper').apiRoot;

// Tests for the root level of the API
describe(`${apiRoot}`, () => {
  //Root level
  describe('GET /', () => {
    it('responds 200 with overview json', (done) => {
      supertest(api)
        .get(apiRoot)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200)
        .end( (err, res) => {
          if (err) return done(err); 
          expect(res.body.name).to.equal(appInfo.name);
          done();
        });
    });
  });

  ////register
  describe('API - POST /authorize', () => {
    it('responds 201 & creates user if not found & returns user + token', (done) => {
      let newUser = {email: 'test@test.com', password: 'password', name: 'Jeremiah'};
      supertest(api)
        .post(apiRoot + "authorize")
        .set('Accept', 'application/json')
        .send(newUser)
        .expect('Content-Type', /json/)
        .expect(201)
        .end( (err, res) => {
          if (err) return done(err); 
          expect(res.body.user.email).to.equal(newUser.email);
          done();
        });
    });
    it('responds 200 & returns user + token if user already exists', (done) => {
      let newUser = {email: 'test@test.com', password: 'password', name: 'Jeremiah'};

      User.create(newUser, (err, existingUser) => {
        if (err) return done(err);

        supertest(api)
          .post(apiRoot + "authorize")
          .set('Accept', 'application/json')
          .send(newUser)
          .expect('Content-Type', /json/)
          .expect(200)
          .end( (err, res) => {
            if (err) return done(err); 
            expect(res.body.user.email).to.equal(existingUser.email);
            expect(res.body.token).to.equal(existingUser.generateToken());
            done();
          });
      });
    });
  });
});