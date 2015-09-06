process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var checkins = require('../fixtures/checkins');

var Checkin = require('../../models/checkin')(app);
var expect = require('chai').expect;

describe('Checkin Model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Checkin.sync({
          force: true
        });
      })
      .then(function() {
        done();
      });
  });

  describe('create checkin', function() {
    checkins.forEach(function(c) {
      it('should create valid checkin', function(done) {
        Checkin.create(c)
          .then(function(ret) {
            //console.log(ret);
            expect(c.id).to.equal(ret.id);
            done();
          });

      });
    });
  });

});
