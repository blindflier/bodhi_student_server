process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var _ = require('lodash');

var should = require('chai').should();
var expect = require('chai').expect;

var Student = require('../../models/student')(app);
var Grade = require('../../models/grade')(app);
var fixtures = require('../fixtures/students');

var grades = require('../fixtures/grades');

describe('Student Model', function() {


  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Grade.sync({
          force: true
        });
      })
      .then(function() {
        return Student.sync({
          force: true
        })
      })
      .then(function() {
        return Grade.bulkCreate(grades.valid_grades);
      })
      .then(function() {
        return app.db.query('SET FOREIGN_KEY_CHECKS = 1');
      })
      .then(function() {
        done();
      });

  });

  // after(function(done) {
  //   Student.drop().then(function() {
  //     Grade.drop();
  //   })
  //   .then(function(){
  //    done();
  //   });
  // });



  describe('Create Student', function() {
    var i = 0;
    fixtures.valid_students.forEach(function(student) {
      it('should create valid users ' + (++i), function(done) {
        Student.create(student).then(function(s) {
          expect(s.id).to.equal(student.id);
          done();
        });
      });
    });

    i = 0;
    fixtures.valid_students.forEach(function(student) {
      it('should not create duplicate users ' + (++i), function(done) {
        Student.create(student).catch(function(e) {
          //console.log(e);
          expect(e).to.exist;
          done();
        });
      });
    });

    i = 0;
    fixtures.invalid_students.forEach(function(student) {
      it('should not create invalid users ' + (++i), function(done) {
        Student.create(student).catch(function(e) {
          //console.log(e);
          expect(e).to.exist;
          done();
        });
      });
    });

  });


});
