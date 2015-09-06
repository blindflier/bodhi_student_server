var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {
    var Student = require('../../basic-info/models/student')(app);
    var Gongxiu = require('../models/gongxiu')(app);
    var Checkin = require('../models/checkin')(app);
    var Course = require('../models/course')(app);
    var Grade = require('../../basic-info/models/grade')(app);
    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app, router, Gongxiu);

    helper.on('read', function(options, data) {
        options.where = options.where || {};
        options.order = 'holding_time desc,grade_id desc';
        options.include = [{
            model: Course
        }, {
            model: Grade
        },{
            model: Checkin
        }];
        if (data.grade_id && data.grade_id > 0)
            options.where.grade_id = data.grade_id;
    });
    helper.crud({
        'default': ['STUDY_ADMIN','STUDY_CLASS_ADMIN'],
        'read': [],
        'readOne': []
    });

    //获取考勤数据
    router.get('/api/gongxiu/:id/checkin', function*(next) {
        var options = {
            'where': {
                gongxiu_id: this.params.id
            },
            'include' : [{
              model: Student
            }]
        };
        var res = yield Checkin.findAndCountAll(options);
        this.body = {
            'success': true,
            'total': res.count,
            'data': res.rows
        };
    });
    //设置 考勤数据
    router.post('/api/gongxiu/:id/checkin', function*(next) {

        if (!this.student.permissions.contains(['STUDY_ADMIN','STUDY_CLASS_ADMIN']))
            this.throw(403);

        var gongxiu = yield Gongxiu.findOne({
            'where': {
                id: this.params.id
            }
        });
        if (!gongxiu)
            this.throw('bad id', 500);

         if (!(this.data && this.data.checkins && this.data.checkins.length))
            this.throw('bad checkins', 500);

        var ret = yield Gongxiu.setCheckins(this.params.id,this.data.checkins);
        this.body = {
            success: !!ret
        };
    });

    return router;
};
