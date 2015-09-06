var cryptoHelper = require('../../../../util/crypto-helper');

var should = require('chai').should();
var expect = require('chai').expect;

describe('Crypto Helper', function() {
  describe('generate random string', function() {
    it('random string should not duplicate', function() {
      var i = 0,
        arr = [],
        j = 0,
        str, len;
      for (i = 0; i < 1000; i++) {
        str = cryptoHelper.randomString(32);
        expect(str.length).to.equal(32);
        for (j = 0; j < i; j++) {
          str.should.not.equal(arr[j]);
        }
        arr.push(str);
      };
    });
  });


});
