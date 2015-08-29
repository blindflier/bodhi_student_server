process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var expect = require('chai').expect;



var User = require('../../models/user')(app);
var Permission = require('../../models/permission')(app);
var Role = require('../../models/role')(app);
var UsersRoles = require('../../models/user_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);

var users = require('../fixtures/users');
var permissions = require('../fixtures/permission');
var roles = require('../fixtures/roles');



var _ = require('lodash');

var request = require('supertest');
var token;

describe('Role Controller', function() {


    before(function(done) {

        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Promise.all([
                    User.sync({
                        force: true
                    }), Permission.sync({
                        force: true
                    }), Role.sync({
                        force: true
                    }),
                    UsersRoles.sync({
                        force: true
                    }), RolesPermissions.sync({
                        force: true
                    })
                ]);
            })
            .then(function() {
                return Promise.all([User.bulkCreate(users),
                    Permission.bulkCreate(permissions),
                    Role.bulkCreate(roles)
                ]);
            })

        .then(function() {
            request(app.listen()).get('/api/token')
                .send(users[0])
                .expect(200)
                .end(function(err, res) {
                    console.log(err);
                    if (err)
                        throw err;
                    token = res.body.token.token;
                    expect(res.body.success).to.be.true;

                    done();
                });
        });

    });




    describe('create role with users and permissions', function() {
        var i = 0;
        roles.forEach(function(r) {
            it('should add role success ' + (++i), function(done) {
                request(app.listen()).post('/api/roles')
                    .send(r)
                    .set('jwt-token',token)
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

    xdescribe('get role', function() {
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


        it('should read all permissions', function(done) {
            request(app.listen()).get('/api/permissions')
                .send({
                    limit: 10
                })
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


    xdescribe('destroy role', function() {
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


        it('should destroy  permissions', function(done) {
            request(app.listen()).delete('/api/permissions/' + 1)
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
