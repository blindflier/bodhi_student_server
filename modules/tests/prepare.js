process.env.NODE_ENV = 'test';

var app = require('../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var User = require('system/models/user')(app);


var Role = require('../../models/Role')(app);
var roles = require('../fixtures/roles');


var Permission = require('../../models/permission')(app);
var permissions = require('../fixtures/permission');

var UsersRoles = require('../../models/user_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);


var _ = require('lodash');

var request = require('supertest');

var token;

describe('User Controller', function() {


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
                var permissions;
                var roles;
                var users;
                return Permission.findAll()
                    .then(function(p) {
                        permissions = p;
                        return Role.findAll();
                    })
                    .then(function(r) {
                        var pm = [];
                        roles = r;
                        roles.forEach(function(r) {
                            pm.push(r.addPermissions(permissions));
                        });
                        return Promise.all(pm);
                    })
                    .then(function() {
                        return User.findAll();
                    })
                    .then(function(users) {
                        var pm = [];
                        users.forEach(function(u) {
                            pm.push(u.addRoles(roles));
                        });
                        return Promise.all(pm);
                    })
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


    describe('user login', function() {
        var i = 0;
        users.forEach(function(u) {
            it('should login success ' + (++i), function(done) {
                request(app.listen()).get('/api/token')
                    .send(u)
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




    describe('get users', function() {
        it('should get users', function(done) {
            request(app.listen()).get('/api/users')
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

    describe('add users', function() {


        var i = 0;

        var extra_users = [{
            admin: true,
            username: 'admin2',
            password: '88888da888'
        }, {
            admin: true,
            username: 'b2dad',
            password: '1232456'
        }];

        extra_users.forEach(function(p) {
            it('should add user success ' + (++i), function(done) {
                request(app.listen()).post('/api/users')
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
