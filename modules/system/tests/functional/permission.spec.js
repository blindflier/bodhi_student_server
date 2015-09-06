process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var expect = require('chai').expect;


var Student = require('../../../basic-info/models/student')(app);
var Permission = require('../../models/permission')(app);
var permissions = require('../fixtures/permissions');
var students = require('../fixtures/students');


var _ = require('lodash');

var request = require('supertest');

var token = app.util.misc.createToken('admin', 1, app.config.secretKey);



describe('Permission Controller', function() {


    before(function(done) {

        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Permission.sync({
                    force: true
                });
            })
            .then(function() {
                return Student.sync({
                    force: true
                });
            })
            .then(function() {
                done();
            });

    });




    describe('add permission', function() {
        var i = 0;
        permissions.forEach(function(p) {
            it('should add permission success ' + (++i), function(done) {
                request(app.listen()).post('/api/permissions')
                    .set('jwt-token', token)
                    .send(p)
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

    describe('get permission', function() {
        before(function(done) {
            Permission.destroy({
                    truncate: true
                })
                .then(function() {
                    Permission.bulkCreate(permissions).then(function() {
                        done();
                    });
                });
        });


        it('should read all permissions', function(done) {
            request(app.listen()).get('/api/permissions')
                .send({
                    limit: 10
                })
                .set('jwt-token', token)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.length).to.equal(permissions.length);
                    done();
                });
        });
    });


    describe('destroy permission', function() {
        before(function(done) {
            Permission.destroy({
                    truncate: true
                })
                .then(function() {
                    Permission.bulkCreate(permissions).then(function() {
                        done();
                    });
                })
        });


        it('should destroy permissions', function(done) {
            request(app.listen()).delete('/api/permissions/' + 1)
                .set('jwt-token', token)
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

    describe('update permission', function() {
        before(function(done) {
            Permission.destroy({
                    truncate: true
                })
                .then(function() {
                    Permission.bulkCreate(permissions).then(function() {
                        done();
                    });
                })
        });

        permissions.forEach(function(p) {
            it('should update permission', function(done) {
                request(app.listen()).put('/api/permissions/' + p.id)
                    .set('jwt-token', token)
                    .send(p)
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


});
