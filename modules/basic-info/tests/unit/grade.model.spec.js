process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var Grade = require('../../models/grade')(app);
var grades = require('../fixtures/grades');

var expect = require('chai').expect;

describe('grade model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
      return Grade.sync({
       force: true
     });
    })
     .then(function(){
      return app.db.query('SET FOREIGN_KEY_CHECKS = 1');
    })
      .then(function() {
        done();
      });
  });

  // after(function(done) {
  //   Grade.drop().then(function(){
  //     done();
  //   });
  // });

  var index = 1;
  grades.valid_grades.forEach(function(g) { 

    it('should create valid grade ' + index++, function(done) {
        Grade.create(g).then(function(grade){
          expect(g.id).to.equal(grade.id);
          done();
        })
    });

  });

});
