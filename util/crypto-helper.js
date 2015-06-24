var crypto = require('crypto');

function md5(str) {
  var hash = require('crypto').createHash('md5');
  return hash.update(str + "").digest('hex');
}

function time() {
  return Math.floor(Date.now()/1000);
}

function microtime(get_as_float) {
  var unixtime_ms = new Date().getTime();
  var sec = parseInt(unixtime_ms / 1000);
  return get_as_float ? (unixtime_ms / 1000) : (unixtime_ms - (sec * 1000)) / 1000 + ' ' + sec;
}


exports.md5 = md5;


exports.makeHashedPassword = function(pwd, salt) {
  if (!pwd)
    return '';
  var md5pass1 = md5(pwd).toUpperCase();
  return md5(md5pass1 + salt).toUpperCase();
};

var randomString;
exports.randomString = randomString = function(size,code_string) {
  size = size || 6;
  code_string = code_string || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var max_num = code_string.length - 1;
  var new_pass = '';
  var index;
  while (size > 0) {
    index = Math.round(Math.random() * max_num);
    //console.log('index='+index);
    new_pass += code_string.charAt(index);
    size--;
  }
  return new_pass;
};

exports.randomNumberString = function(size) {
  return randomString(size,'0123456789');
};