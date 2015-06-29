var util = require('util');
var globby = require('globby');

module.exports.usefulArray = function(a){
  return (util.isArray(a) && a.length>0);
}