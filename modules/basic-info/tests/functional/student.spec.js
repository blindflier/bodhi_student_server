process.env.NODE_ENV = 'test';
var app = require('../../../../app');


var should = require('chai').should();
var expect = require('chai').expect;

var Student = require('../../models/student')(app);
var Grade = require('../../models/grade')(app);

var fixtures = require('../fixtures/students');
var grades = require('../fixtures/grades');


var request = require('supertest');

var token = app.util.misc.createToken('admin', 1, app.config.secretKey);

var badtoken = app.util.misc.createToken('student', 1, app.config.secretKey);

var systemStudents;

describe('Student Controller', function() {


    before(function(done) {
        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            // .then(function() {
            //     return Grade.sync({
            //         force: true
            //     });
            // })
            // .then(function() {
            //     return Student.sync({
            //         force: true
            //     });
            // })
            // .then(function() {
            //     return Grade.bulkCreate(grades.valid_grades);
            // })
            .then(function() {
                return require('../../../system/tests/fixtures/prepare_permission')();
            })
            .then(function() {
                return Student.count();
            })
            .then(function(c) {
                systemStudents = c;
                console.log('system users ' + c);
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

        // after(function(done) {
        //     Student.destroy({
        //         where: {
        //           id: {
        //             $gt: systemStudents
        //           }
        //         }
        //     }).then(function() {
        //         done();
        //     });
        // });

        var i = 0;
        fixtures.valid_students.forEach(function(student) {
            it('should create valid students ' + (++i), function(done) {
                request(app.listen()).post('/api/students')
                    .send(student)
                    .set('jwt-token', token)
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

            it('should not create valid students ' + i + ' with bad token', function(done) {
                request(app.listen()).post('/api/students')
                    .send(student)
                    .set('jwt-token', badtoken)
                    .expect(200)
                    .end(function(err, res) {
                        if (err)
                            throw err;
                        console.log(res.body);
                        done();
                    });
            });
        });


        i = 0;
        fixtures.valid_students.forEach(function(student) {
            it('should not create duplicate student ' + (++i), function(done) {
                request(app.listen()).post('/api/students')
                    .send(student)
                    .set('jwt-token', token)
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
                    .set('jwt-token', token)
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

        it('should get a student', function(done) {
            //var id = fixtures.valid_students[0].id;
            request(app.listen()).get('/api/students/' + 1)
                .expect(200)
                .set('jwt-token', token)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.id).to.equal(1);
                    done();
                });
        });


        it('should get all students support offset and limit', function(done) {
            request(app.listen()).get('/api/students')
                .send({
                    offset: 1,
                    limit: 1
                })
                .set('jwt-token', token)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    //console.log(res.body.students[0].grade);
                    var students = res.body;
                    expect(res.body.success).to.be.true;
                    expect(res.body.data).have.property('length', 1);
                    //expect(res.body.data[0].id).to.equal(fixtures.valid_students[1].id);
                    done();
                });
        });

        it('should not get user when id not correct', function(done) {
            request(app.listen()).get('/api/students/' + 10000)
                .expect(200)
                .set('jwt-token', token)
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
        var s1;
        before(function(done) {
            //Student.bulkCreate(fixtures.valid_students)
            Student.findOne({
                    'where': {
                        'id': {
                            '$gt': systemStudents
                        }
                    }
                })
                .then(function(s) {
                    s1 = s;
                    done();
                });
        });

        // after(function(done) {
        //     Student.destroy({
        //         truncate: true
        //     }).then(function() {
        //         done();
        //     });
        // });

        it('should destroy student by id', function(done) {

            request(app.listen()).delete('/api/students/' + s1.id)
                .expect(200)
                .set('jwt-token', token)
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
        var s1;
        before(function(done) {
            //Student.bulkCreate(fixtures.valid_students)
            Student.findOne({
                    'where': {
                        'id': {
                            '$gt': systemStudents
                        }
                    }
                })
                .then(function(s) {
                    s1 = s;
                    done();
                });
        });

        it('should update student email', function(done) {
            var id = s1.id;
            var new_email = '333334@qq.com';
            request(app.listen()).put('/api/students/' + id)
                .send({
                    email: new_email
                })
                .set('jwt-token', token)
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
                        expect(s.email).to.equal(new_email);
                        done();
                    });

                });
        });

    });

    describe('student login', function() {
        before(function(done) {
            Student.destroy({
                where: {
                    id: {
                        '$gt': systemStudents
                    }
                }
            }).then(function() {
                return Student.bulkCreate(fixtures.valid_students);
            })
            .then(function(s) {
                done();
            });
        });

        var i = 0;
        fixtures.valid_students.forEach(function(u) {
            it('should login success ' + (++i), function(done) {
                request(app.listen()).get('/api/token')
                    .send(u)
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


    });


});
