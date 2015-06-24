var cryptoHelper = require('../../../../util/crypto-helper');

var should = require('chai').should();
var expect = require('chai').expect;

xdescribe('Crypto Helper', function() {
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


  describe('authcode', function() {
    var source = cryptoHelper.randomString(256);
    var secret = cryptoHelper.randomString(32);

    it('authcode without any input', function() {
        var encode = cryptoHelper.authcode();
        expect(encode).to.be.empty;
    });

    it('encode & decode ', function(done) {

      cryptoHelper.authcode('', 'DECODE', secret).should.empty;

      var encoded1 = cryptoHelper.authcode(source, 'ENCODE', secret);
      var decoded = cryptoHelper.authcode(encoded1, 'DECODE', secret);

      decoded.should.equal(source);

      var encoded2 = cryptoHelper.authcode(source, 'ENCODE', secret, 1);
      encoded1.should.not.equal(encoded2);

      decoded = cryptoHelper.authcode(encoded2, 'DECODE', secret);
      decoded.should.equal(source);

      setTimeout(function() {
        decoded = cryptoHelper.authcode(encoded2, 'DECODE', secret);
        decoded.should.equal(source);
        //done();
      }, 10);

      setTimeout(function() {
        decoded = cryptoHelper.authcode(encoded2, 'DECODE', secret);
        decoded.should.empty;
        done();
      }, 1100);
    });

    // it('encode empty string should output', function(done) {
      
    // });

  });


});
