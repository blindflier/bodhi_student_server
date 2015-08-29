process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var courses = require('../fixtures/courses');

var Course = require('../../models/Course')(app);


var expect = require('chai').expect;

describe('Course Model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Course.sync({
          force: true
        });
      })
      .then(function() {
        done();
      });
  });

  describe('create courses', function() {
    courses.forEach(function(c) {
      it('should create valid courses', function(done) {
        Course.create(c)
          .then(function(ret) {
            //console.log(ret);
            expect(c.subject).to.equal(ret.subject);
            done();
          });

      });
    });
  });

});
