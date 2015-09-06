var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

    var Course = require('../models/course')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app,router,Course);

    helper.on('read', function(options, data) {

        options.where = options.where || {};
        options.order = 'category asc,seq asc';
        if (data.category && data.category!= '所有') {
            options.where.category = data.category;
        }
        if (data.search) {
            data.search = data.search.toUpperCase()
            options.where.subject = {
                '$like': '%' + data.search + '%'
            };
        }
    });
       helper.crud({
            'default' : ['STUDY_ADMIN'],
            'read' : [],
            'readOne' : []
        });

    return router;
};
