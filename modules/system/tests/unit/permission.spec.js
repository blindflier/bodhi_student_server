process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var Permission = require('../../models/permission')(app);
var RolesPermssions = require('../../models/role_permission')(app);

var permissions = require('../fixtures/permission');
var expect = require('chai').expect;
describe('Permission Model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Permission.sync({
          force: true
        });
      })
      .then(function() {
        return Permission.bulkCreate(permissions);
      })
      .then(function() {
        return RolesPermssions.sync({
          force: true
        });
      })
      .then(function() {
        done();
      });
  });

  describe('create permission', function() {

    beforeEach(function(done) {
      Permission.destroy({
          truncate: true
        })
        .then(function() {
          done();
        });
    });


    permissions.forEach(function(p) {
      it('should create valid permissions', function(done) {
        Permission.create(p).then(function(r) {
          expect(p.code).to.equal(r.code);
          done();
        });
      });

    });

  });

});
