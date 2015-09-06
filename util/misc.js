var util = require('util');
var globby = require('globby');
var jwt = require('jsonwebtoken');
var moment = require('moment');


function usefulArray (a) {
    return (util.isArray(a) && a.length > 0);
}

function createToken(username,hours,secret) {
  var  exp = moment().add(hours,'hours').valueOf();
  return    jwt.sign({
                'iss': username,
                'exp': exp
            }, secret);
}


module.exports = {
  'usefulArray' : usefulArray,
  'createToken' : createToken
};
