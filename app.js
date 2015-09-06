var koa = require('koa');
var app = koa();
var config = require('./util/config');
var Sequelize = require('sequelize');

app.config = config;
app.db = new Sequelize(config.db, {
    underscored: true,
    logging: process.NODE_ENV != 'production',
    pool: process.NODE_ENV != 'test',
});
app.util = {
    crypto: require('./util/crypto-helper'),
    misc: require('./util/misc')
};

app.permissions = {};
app.addPermissions = function(permissions){
   permissions.forEach(function(p){
      
   });
};

module.exports = app;

//配置logger
if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    var logger = require('koa-logger');
    //console.log('starting logger...');
    app.use(logger());
}

//载入模块
var loadModule = require('./util/load-module');

var modules = ['authorize','error','request-parse', 'system','study','basic-info'];
var mpm = [];
modules.forEach(function(m) {
    mpm.push(loadModule(app, config.root + '/modules/' + m));
});

Promise.all(mpm);
