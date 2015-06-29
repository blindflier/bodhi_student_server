var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

  var Permission = require('../models/permission')(app);
  
 var ControllerHelper =  require(app.config.root + '/util/controller_helper');
 var helper = new ControllerHelper();

   helper.on('read',function(options, data){
    if (data.search){
        data.search = data.search.toUpperCase()
        options.where = options.where || {};
        options.where.$or = [{
          'name':  {'$like': '%'+data.search+'%'}
        },{
          'code':  {'$like': '%'+data.search+'%'}
        }];
      }
    });
  helper.crud(router,Permission);

  return router;
};
