process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var users = require('../fixtures/users');
var roles = require('../fixtures/roles');
var permissions = require('../fixtures/permission');


var Role = require('../../models/role')(app);
var User = require('../../models/user')(app);
var Permission = require('../../models/permission')(app);
var UsersRoles = require('../../models/user_role')(app);
var RolesPermssions = require('../../models/role_permission')(app);
var expect = require('chai').expect;

describe('Role Model', function() {

    before(function(done) {
        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Permission.sync({
                    force: true
                });
            })
             .then(function() {
                return User.sync({
                    force: true
                });
            })
            .then(function() {
                return Role.sync({
                    force: true
                });
            })
            .then(function() {
                return RolesPermssions.sync({
                    force: true
                });
            })
            .then(function() {
                return UsersRoles.sync({
                    force: true
                });
            })
            .then(function(){
                return User.bulkCreate(users);
            })
          
            .then(function() {
                done();
            });
    });

    describe('create roles', function() {

        it('should create valid roles', function(done) {
            var p;
            Permission.create(permissions[0])
                .then(function(ret) {
                    p = ret;
                    console.dir(p);
                    return Role.create(roles[0]);
                })
                .then(function(ret) {
                    expect(roles[0].name).to.equal(ret.name);
                    return ret.addPermission(p);
                })
                .then(function() {
                    done();
                });
        });
    });

});
