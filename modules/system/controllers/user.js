var _ = require('lodash');
var router = require('koa-router')();


module.exports = function(app) {

    var User = require('../models/user')(app);
    var Student = require('../../basic-info/models/student')(app);
    var Role = require('../models/role')(app);
    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper();
    //登录
    router.post('/api/login', function*(next) {
        if (!this.data.username || !this.data.password)
            throw '错误的用户名或密码';

        var u = yield User.findOne({
            'where': {
                'username': this.data.username
            }
        });
        if (!u || !u.validatePassword(this.data.password))
            throw '错误的用户名或密码';

        var permissions = yield u.getPermissions();
        var pc = [];
        permissions.forEach(function(p) {
            pc.push(p.code);
        });

        this.body = {
            'success': true,
            'user': {
                id: u.get('id'),
                username: u.get('username'),
                permissions: pc
            }
        };
    });

    //CRUD

    helper.on('read', function(options, data) {
        if (data.username || data.search) {
            options.where = options.where || {};
            options.where.username = {
                '$like': '%' + (data.username || data.search) + '%'
            };
        }
        options.attributes = ['id', 'username','student_id'];
        options.include = [{
            model: Role,
            attributes: ['id', 'name']
        },{
            model: Student,
            attributes: ['id', 'name','bud_name']
        }];

    });


    helper.on('readOne', function(options) {

        options.include = [{
            model: Role,
            attributes: ['id', 'name']
        }];

    });


    helper.crud(router, User);
    return router;

};
