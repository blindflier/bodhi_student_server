process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var expect = require('chai').expect;



var Student = require('../../../basic-info/models/student')(app);
var Permission = require('../../models/permission')(app);
var Role = require('../../models/role')(app);
var StudentsRoles = require('../../models/student_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);

var students = require('../fixtures/students');
var permissions = require('../fixtures/permissions');
var roles = require('../fixtures/roles');



var _ = require('lodash');

var request = require('supertest');

var token = app.util.misc.createToken(students[0].username, 1, app.config.secretKey);


describe('Role Controller', function() {


    before(function(done) {

        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Promise.all([
                    Student.sync({
                        force: true
                    }), Permission.sync({
                        force: true
                    }), Role.sync({
                        force: true
                    }),
                    StudentsRoles.sync({
                        force: true
                    }), RolesPermissions.sync({
                        force: true
                    })
                ]);
            })
            .then(function() {
                done();
            });

    });




    describe('create role', function() {
        var i = 0;
        roles.forEach(function(r) {
            it('should add role success ' + (++i), function(done) {
                request(app.listen()).post('/api/roles')
                    .send(r)
                    .set('jwt-token', token)
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

    describe('get roles', function() {
        before(function(done) {
            Role.destroy({
                    truncate: true
                })
                .then(function() {
                    Role.bulkCreate(roles).then(function() {
                        done();
                    });
                })
        });


        it('should read all roles', function(done) {
            request(app.listen()).get('/api/roles')
                .send({
                    limit: 10
                })
                .set('jwt-token',token)
                .expect(200)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    //console.log(res.body);
                    expect(res.body.success).to.be.true;
                    expect(res.body.data.length).to.equal(roles.length);
                    done();
                });
        });
    });


    describe('destroy role', function() {
         before(function(done) {
            Role.destroy({
                    truncate: true
                })
                .then(function() {
                    Role.bulkCreate(roles).then(function() {
                        done();
                    });
                })
        });


        it('should destroy role', function(done) {
            request(app.listen()).delete('/api/roles/' + 1)
                .expect(200)
                .set('jwt-token',token)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    console.log(res.body);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });
    });


    describe('update roles', function() {
        before(function(done) {
            Role.destroy({
                    truncate: true
                })
                .then(function() {
                    Role.bulkCreate(roles).then(function() {
                        done();
                    });
                });
        });

        roles.forEach(function(r) {
            it('should update role', function(done) {
                request(app.listen()).put('/api/roles/' + r.id)
                    .set('jwt-token', token)
                    .send(r)
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
