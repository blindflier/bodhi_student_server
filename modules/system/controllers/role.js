var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

  var Role = require('../models/role')(app);
    
 var ControllerHelper =  require(app.config.root + '/util/controller_helper');
 var helper = new ControllerHelper();
 
   helper.on('read',function(options, data){
    if (data.name || data.search){
        options.where = options.where || {};
        options.where.name =  {'$like': '%'+(data.name||data.search)+'%'};
      }
    });

  helper.crud(router,Role);
  return router;
};
