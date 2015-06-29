process.env.NODE_ENV = 'test';
var app = require('../../../../app');


var should = require('chai').should();
var expect = require('chai').expect;

var Student = require('../../models/student')(app);
var Grade = require('../../models/grade')(app);

var fixtures = require('../fixtures/students');
var grades = require('../fixtures/grades');


var request = require('supertest');



describe('Student Controller', function() {


  before(function(done) {

    
       app.db.query('SET FOREIGN_KEY_CHECKS = 0')
    .then(function(){
      return Grade.sync({
       force: true
     });
    })
    .then(function(){
        return Student.sync({force:true});
      })
      .then(function() {
        return Grade.bulkCreate(grades.valid_grades);
      })
   
      .then(function() {
        done();
      });
  });

  // after(function(done) {
  //   Student.drop().then(function() {
  //       return Grade.drop();
  //     })
  //     .then(function() {
  //       done();
  //     });
  // });



  describe('create student', function() {

    after(function(done) {
      Student.destroy({
        truncate: true
      }).then(function() {
        done();
      });
    });

    var i = 0;
    fixtures.valid_students.forEach(function(student) {
      it('should create valid users ' + (++i), function(done) {
        request(app.listen()).post('/api/students')
          .send(student)
          .expect(200)
          .end(function(err, res) {
            if (err)
              throw err;
            //console.log(res.body);
            expect(res.body.success).to.be.true;
            expect(res.body.data).to.exist;
            done();
          });
      });
    });


    i = 0;
    fixtures.valid_students.forEach(function(student) {
      it('should not create duplicate student ' + (++i), function(done) {
        request(app.listen()).post('/api/students')
          .send(student)
          .expect(200)
          .end(function(err, res) {
            if (err)
              throw err;
            //console.log(res.body);
            expect(res.body.success).to.be.false;
            done();
          });
      });
    });

    i = 0;
    fixtures.invalid_students.forEach(function(student) {
      it('should not create invalid student ' + (++i), function(done) {
        request(app.listen()).post('/api/students')
          .send(student)
          .expect(200)
          .end(function(err, res) {
            if (err)
              throw err;
            //console.log(res.body);
            expect(res.body.success).to.be.false;
            done();
          });
      });
    });

  });


  describe('read student', function() {

    before(function(done) {
      Student.bulkCreate(fixtures.valid_students).then(function() {
        done();
      });
    });

    after(function(done) {
      Student.destroy({
        truncate: true
      }).then(function() {
        done();
      });
    });

    it('should get a student', function(done) {
      var id = fixtures.valid_students[0].id;
      request(app.listen()).get('/api/students/' + id)
        .expect(200)
        .end(function(err, res) {
          if (err)
            throw err;
          //console.log(res.body);
          expect(res.body.success).to.be.true;
          expect(res.body.data.id).to.equal(id);
          done();
        });
    });


    it('should get all students support offset and limit', function(done) {
      request(app.listen()).get('/api/students')
        .send({
          offset: 1,
          limit: 1
        })
        .expect(200)
        .end(function(err, res) {
          if (err)
            throw err;
          //console.log(res.body);
          //console.log(res.body.students[0].grade);
          var students = res.body;
          expect(res.body.success).to.be.true;
          expect(res.body.data).have.property('length', 1);
          expect(res.body.data[0].id).to.equal(fixtures.valid_students[1].id);
          done();
        });
    });

    it('should not get user when id not correct', function(done) {
      request(app.listen()).get('/api/students/' + 10000)
        .expect(200)
        .end(function(err, res) {
          if (err)
            throw err;
          //console.log(res.body);
          expect(res.body.success).to.be.false;
          done();
        });
    });

  });

  describe('destroy student', function() {
    before(function(done) {
      Student.bulkCreate(fixtures.valid_students).then(function() {
        done();
      });
    });

    after(function(done) {
      Student.destroy({
        truncate: true
      }).then(function() {
        done();
      });
    });

    it('should destroy student by id', function(done) {

      request(app.listen()).delete('/api/students/' + fixtures.valid_students[0].id)
        .expect(200)
        .end(function(err, res) {
          if (err)
            throw err;
          console.log(res.body);
          expect(res.body.success).to.be.true;
          done();
        });

    });

  });

  describe('update student', function() {
    before(function(done) {
      Student.bulkCreate(fixtures.valid_students).then(function() {
        done();
      });
    });

    after(function(done) {
      Student.destroy({
        truncate: true
      }).then(function() {
        done();
      });
    });

    it('should update student email', function(done) {
      var id = fixtures.valid_students[0].id;
      request(app.listen()).put('/api/students/' + id)
        .send({
          email: '33333@qq.com'
        })
        .expect(200)
        .end(function(err, res) {
          if (err)
            throw err;
          console.log(res.body);
          expect(res.body.success).to.be.true;
          Student.find({
            where: {
              id: id
            }
          }).then(function(s) {
            //console.log(s);
            expect(s.email).to.equal('33333@qq.com');
            done();
          });

        });
    });

  });

});
