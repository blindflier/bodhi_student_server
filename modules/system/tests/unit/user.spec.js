process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var roles = require('../fixtures/roles');
var users = require('../fixtures/users');


var Role = require('../../models/role')(app);
var User = require('../../models/user')(app);
var UsersRoles = require('../../models/user_role')(app);

var expect = require('chai').expect;

describe('Role Model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
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
        return UsersRoles.sync({
          force: true
        });
      })
      .then(function() {
        done();
      });
  });

  describe('create roles', function() {
    users.forEach(function(u) {
      it('should create valid users', function(done) {
        User.create(u)
          .then(function(ret) {
            //console.log(ret);
            expect(u.username).to.equal(ret.username);
            expect(ret.validatePassword(u.password)).to.be.true;
            done();
          });

      });
    });
  });

});
