var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

  var Gongxiu = require('../models/gongxiu')(app);
   var Course = require('../models/course')(app);
   var Grade = require('../../basic-info/models/grade')(app);
 var ControllerHelper =  require(app.config.root + '/util/controller_helper');
 var helper = new ControllerHelper(app,router,Gongxiu);

   helper.on('read',function(options, data){
      options.where = options.where || {};
      options.order = 'holding_time desc,grade_id desc';
      options.include = [{
            model: Course
        },{
          model: Grade
        }];
      if (data.grade_id && data.grade_id > 0)
            options.where.grade_id = data.grade_id;
    });
  helper.crud([]);


  return router;
};
