var router = require('koa-router')();
var _ = require('lodash');


module.exports = function(app) {

    var Student = require('../models/student')(app);
    var Grade = require('../models/grade')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app,router,Student);
    helper.on('read', function(options, data) {
        options.where = options.where || {};
        options.include = [{
            model: Grade,
            attributes: ['id', 'city', 'genre', 'seq']
        }];

        if (data.grade_id && data.grade_id > 0)
            options.where.grade_id = data.grade_id;
        else {
            if (data.city && data.city !== '所有') {
                options.include[0].where = {
                    'city': data.city
                }
            }
        }
        if (data.state >= 0){
             options.where.state = data.state;
        }
        if (data.allname) {
            options.where.$or = [{
                'name': {
                    '$like': '%' + data.allname + '%'
                }
            },{
                'bud_name':{
                    '$like': '%' +data.allname+'%'
                }
            }];
        }
    });

    helper.crud([]);

    return router;
};
