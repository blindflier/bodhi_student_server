process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var gongxiu = require('../fixtures/gongxiu');

var GXModel = require('../../models/gongxiu')(app);


var expect = require('chai').expect;

describe('Gongxiu Model', function() {

  before(function(done) {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return GXModel.sync({
          force: true
        });
      })
      .then(function() {
        done();
      });
  });

  describe('create gongxiu', function() {
    gongxiu.forEach(function(c) {
      it('should create valid gongxiu', function(done) {
        GXModel.create(c)
          .then(function(ret) {
            //console.log(ret);
            expect(c.holding_time).to.equal(ret.holding_time);
            done();
          });

      });
    });
  });

});
