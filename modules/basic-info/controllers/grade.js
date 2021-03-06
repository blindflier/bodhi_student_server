var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

    var Grade = require('../models/grade')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app,router,Grade);

    helper.on('read', function(options, data) {
        if (data.city && data.city != '所有') {
            options.where = options.where || {};
            options.where.city = {
                '$like': '%' + data.city + '%'
            };
        }
    });
    helper.crud({
        'default' : ['BASICINFO_ADMIN'],
        'read' : [],
        'readOne' : []
    });
    return router;
};
