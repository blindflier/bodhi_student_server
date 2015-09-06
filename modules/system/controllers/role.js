var _ = require('lodash');
var router = require('koa-router')();
var util = require('util');

module.exports = function(app) {

    var Role = require('../models/role')(app);
    var Permission = require('../models/permission')(app);
    var Student = require('../../basic-info/models/student')(app);
    var Student_Role = require('../models/student_role')(app);
    var Role_Permission = require('../models/role_permission')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app,router,Role);

    helper.on('read', function(options, data) {
        options.include = [{
            model: Student,
            attributes: ['id', 'username']
        }, {
            model: Permission,
            attributes: ['id', 'name', 'code']
        }];

        if (data.name || data.search) {
            options.where = options.where || {};
            options.where.name = {
                '$like': '%' + (data.name || data.search) + '%'
            };
        }
    });

    helper.readOne(['SUPER_ADMIN']);
    helper.read(['SUPER_ADMIN']);
    helper.destroy(['SUPER_ADMIN']);

    //create
    router.post('/api/roles', function*(next) {

         if (!this.student.permissions.contains(['SUPER_ADMIN']))
            this.throw(403);

        var options = {};

        var c = yield Role.create(this.data, options);
        if (app.util.misc.usefulArray(this.data.students)) {
            yield Role.setStudents(c.id, this.data.students);
        }
        if (app.util.misc.usefulArray(this.data.permissions)) {
            yield Role.setPermissions(c.id, this.data.permissions);
        }
        this.body = {
            success: true,
            data: c
        };
    });
    //update
    router.put('/api/roles/:id', function*(next) {

        if (!this.student.permissions.contains(['SUPER_ADMIN']))
            this.throw(403);

        var options = {
            'where': {
                id: this.params.id
            }
        };
        var c = yield Role.update(this.data, options);
        if (this.data.students) {
                yield Role.setStudents(this.params.id, this.data.students);
        }
        if (this.data.permissions) {
                yield Role.setPermissions(this.params.id, this.data.permissions);
        }
        this.body = {
            success: !!c
        };

    });
    return router;
};
