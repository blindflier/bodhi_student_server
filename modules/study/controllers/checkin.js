var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

  var Checkin = require('../models/checkin')(app);
  var Gongxiu = require('../models/gongxiu')(app);
  var Course = require('../models/course')(app);
  var Grade = require('../../basic-info/models/grade')(app);
 var ControllerHelper =  require(app.config.root + '/util/controller_helper');
 var helper = new ControllerHelper(app,router,Checkin);

   // helper.on('read',function(options, data){
   //    options.where = options.where || {};
   //    options.order = 'holding_time desc,grade_id desc';
   //    options.include = [{
   //          model: Course
   //      },{
   //        model: Grade
   //      }];
   //    if (data.grade_id && data.grade_id > 0)
   //          options.where.grade_id = data.grade_id;
   //  });
  //helper.crud(router,Checkin);
  
  //增加考勤数据
  router.post('/api/checkin', function*(next) {
        var options = {};
        

        this.data.checkIn.forEach(function(c){
          c.gongxiu_id = this.data.gongxiu_id;
        });

        var c = yield model.bulkCreate(this.data, options);
        self.emit('afterCreate', c,options,this.data);
        this.body = {
            success: true,
            data: c
        };
  });

  return router;
};
