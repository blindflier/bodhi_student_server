process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var Student = require('../../models/student')(app);
var Grade = require('../../models/grade')(app);
var grades = require('../fixtures/grades');

var _ = require('lodash');

var request = require('supertest');
var Sequelize = require('sequelize');

describe('Grade Controller', function() {


    before(function(done) {

        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Grade.sync({
                    force: true
                });
            })
            // .then(function() {
            //     return app.db.query('SET FOREIGN_KEY_CHECKS = 1');
            // })
            .then(function() {
                done();
            });

    });

    // after(function(done) {
    //   Grade.drop().then(function() {
    //     done();
    //   });
    // });

    describe('create grade', function() {

        after(function(done) {
            app.db.query('SET FOREIGN_KEY_CHECKS = 0')
                .then(function() {
                    return Grade.destroy({
                        truncate: true
                    });
                })
                .then(function() {
                    done();
                });
        });

        var i = 0;
        grades.valid_grades.forEach(function(c) {
            //  console.log(c);
            it('should create valid class ' + (++i), function(done) {
                request(app.listen()).post('/api/grades')
                    .send(c)
                    .expect(200)
                    .end(function(err, res) {
                        if (err)
                            throw err;
                        //console.log(res.body);
                        expect(res.body.success).to.be.true;
                        expect(res.body.data).to.be.exist;
                        done();
                    });
            });
        });
    });

    describe('read grades', function() {

        before(function(done) {
            Grade.bulkCreate(grades.valid_grades).then(function() {
                done();
            });
        });

        after(function(done) {
            Grade.destroy({
                truncate: true
            }).then(function() {
                done();
            });
        });

        it('should read all grades', function(done) {
            request(app.listen()).get('/api/grades')
                .send({
                    limit: 10
                })
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.length).to.equal(grades.valid_grades.length);
                    done();
                });

        });

        it('should read grades in 合肥', function(done) {
            request(app.listen()).get('/api/grades')
                .send({
                    city: '合肥',
                    limit: 5
                })
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.length).to.equal(2);
                    done();
                });

        });

        it('should read all grades skip 1 and limit 2', function(done) {
            request(app.listen()).get('/api/grades')
                .send({
                    offset: 1,
                    limit: 2
                })
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.length).to.equal(2);
                    done();
                });

        });

    });

    describe('destroy grades', function() {
        before(function(done) {
            Grade.bulkCreate(grades.valid_grades).then(function() {
                done();
            });
        });

        after(function(done) {
            Grade.destroy({
                truncate: true
            }).then(function() {
                done();
            });
        });

        grades.valid_grades.forEach(function(c) {
            it('should remove grades ' + c.id, function(done) {
                request(app.listen()).delete('/api/grades/' + c.id)
                    .expect(200)
                    .end(function(err, res) {
                        if (err)
                            throw err;
                        //console.log(res.body);
                        expect(res.body.success).to.be.true;
                        done();
                    });
            });
        });

    });

    describe('update grades', function() {
        before(function(done) {
            Grade.bulkCreate(grades.valid_grades).then(function() {
                done();
            });
        });

        after(function(done) {
            Grade.destroy({
                truncate: true
            }).then(function() {
                done();
            });
        });

        grades.valid_grades.forEach(function(c) {
            var cc = _.clone(c);
            cc.seq += 10;
            cc.code = c.code + '2';

            it('should update grades ' + c.id, function(done) {
                request(app.listen()).put('/api/grades/' + c.id)
                    .expect(200)
                    .send({
                        seq: cc.seq,
                        code: cc.code
                    })
                    .end(function(err, res) {
                        if (err)
                            throw err;
                        //console.log(res.body);
                        expect(res.body.success).to.be.true;
                        Grade.find({
                            where: {
                                id: c.id
                            }
                        }).then(function(g) {
                            expect(g.city).to.equal(cc.city);
                            expect(g.code).to.equal(cc.code);
                            expect(g.seq).to.equal(cc.seq);
                            done();
                        });


                    });
            });
        });

    });

});
