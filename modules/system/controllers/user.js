var _ = require('lodash');
var router = require('koa-router')();
var jwt = require('jsonwebtoken');
var moment = require('moment');

module.exports = function(app) {

    var User = require('../models/user')(app);
    var Grade = require('../../basic-info/models/grade')(app);
    var Student = require('../../basic-info/models/student')(app);
    var Role = require('../models/role')(app);
    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app,router,User);

    //登录
    router.get('/api/token', function*(next) {
        var token, exp;
        if (!this.data.admin) { //学员登录
            if (!this.data.username) {
                throw '请输入正确的用户名';
            }
            var s = yield Student.findOne({
                'where': {
                    'student_id': this.data.username
                },
                'include': [{
                    model: Grade
                }],
                attributes: ['id', 'name', 'bud_name']
            });
            if (!s)
                throw '请输入正确的用户名';

            exp = moment().add('hours', 3).valueOf();
            token = jwt.sign({
                'isUser': false,
                'iss': this.data.username,
                'exp': exp
            }, app.config.secretKey);

            this.body = {
                'success': true,
                'token': {
                    'token': token,
                    'exp': exp,
                    'student': s
                }
            };
            return;
        }

        if (!this.data.username || !this.data.password)
            throw '错误的用户名或密码';

        var u = yield User.findOne({
            'where': {
                'username': this.data.username
            }
        }, {
            'include': [{
                model: Student,
                attributes: ['id','grade_id','name', 'bud_name'],
                include: [{
                    model: Grade
                }]
            }]
        });
        if (!u || !u.validatePassword(this.data.password))
            throw '错误的用户名或密码';

        var permissions = yield u.getPermissions();
        var pc = [];
        permissions.forEach(function(p) {
            pc.push(p.code);
        });
        exp = moment().add('days', 7).valueOf();
        console.log('sign:' + u.id + ' ' + exp);
        token = jwt.sign({
            'isUser': true,
            'iss': u.id,
            'exp': exp
        }, app.config.secretKey);


        this.body = {
            'success': true,
            'token': {
                'token': token,
                'exp': exp,
                'student': u.student,
                'user': {
                    'id': u.get('id'),
                    'username': u.get('username'),
                    'permissions': pc,
                }
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
        options.attributes = ['id', 'username', 'student_id'];
        options.include = [{
            model: Role,
            attributes: ['id', 'name']
        }, {
            model: Student,
            attributes: ['id', 'name', 'bud_name']
        }];

    });


    helper.on('readOne', function(options) {

        options.include = [{
            model: Role,
            attributes: ['id', 'name']
        }];

    });


    helper.crud([]);

    return router;

};
