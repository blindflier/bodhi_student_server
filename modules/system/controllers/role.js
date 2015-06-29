var _ = require('lodash');
var router = require('koa-router')();
var util = require('util');

module.exports = function(app) {

    var Role = require('../models/role')(app);
    var User = require('../models/user')(app);
    var Permission = require('../models/permission')(app);
    var User_Role = require('../models/user_role')(app);
    var Role_Permission = require('../models/role_permission')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper();

    helper.on('read', function(options, data) {
        options.include = [{
            model: User,
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


    //helper.create(router, Role);
    helper.readOne(router, Role);
    helper.read(router, Role);
    //helper.update(router, Role);
    helper.destroy(router, Role);

    //create
    router.post('/api/roles', function*(next) {
        var options = {};

        var c = yield Role.create(this.data, options);
        if (app.util.misc.usefulArray(this.data.users)) {
            yield Role.setUsers(c.id, this.data.users);
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
        var options = {
            'where': {
                id: this.params.id
            }
        };
        var c = yield Role.update(this.data, options);
        if (app.util.misc.usefulArray(this.data.users)) {
            yield User_Role.destroy({
                'where': {
                    'role_id': this.params.id
                }
            });
            yield Role.setUsers(this.params.id, this.data.users);
        }
        if (app.util.misc.usefulArray(this.data.permissions)) {
            yield Role_Permission.destroy({
                'where': {
                    'role_id': this.params.id
                }
            });
            yield Role.setPermissions(this.params.id, this.data.permissions);
        }
        this.body = {
            success: !!c
        };

    });
    return router;
};
