var env = process.env.NODE_ENV || 'development';
var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');
//console.log('env:' + env);

var config = {
  common: {
    port: 8000,
    root: rootPath,
    secretKey: '466ee6b4-1f31-11e5-a820-34363bc6488'
  },
  production: {
    db: 'mysql://sqladmin:yjs2216229!+@localhost/students'
  },
  development: {
    db: 'mysql://sqladmin:yjs2216229!+@localhost/students_dev'
  },
  test: {
    db: 'mysql://sqladmin:yjs2216229!+@localhost/students_test'
  }
};

var cfg = config.common;
for (var k in config[env]) {
  cfg[k] = config[env][k];
}

module.exports = cfg;
