var router = require('koa-router')();
var _ = require('lodash');


module.exports = function(app) {

    var Student = require('../models/student')(app);
    var Grade = require('../models/grade')(app);

    var ControllerHelper = require(app.config.root + '/util/controller_helper');
    var helper = new ControllerHelper(app, router, Student);
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
        if (data.state >= 0) {
            options.where.state = data.state;
        }
        if (data.username) {
            options.where.username = {
                '$like': '%' + data.username + '%'
            };
        }
        if (data.allname) {
            options.where.$or = [{
                'name': {
                    '$like': '%' + data.allname + '%'
                }
            }, {
                'bud_name': {
                    '$like': '%' + data.allname + '%'
                }
            }];
        }
    });
    
    helper.on('afterReadOne',function(s){
         s.sanitize();
    });
    helper.on('afterRead',function(res){
         res.rows.forEach(function(row){
             row.sanitize();
         });
    });

    helper.crud({
        'default': ['BASICINFO_ADMIN'],
        'read': [],
        'readOne': []
    });

    //登录
    router.get('/api/token', function*(next) {
        var token, exp;

        if (!this.data.username || !this.data.password)
            throw '错误的用户名或密码';

        var s = yield Student.findOne({
            'where': {
                'username': this.data.username
            }
        }, {
            'include': [{
                model: Grade,
                attributes: ['id', 'code', 'city', 'genre', 'seq']
            }]
        });
        if (!s || !s.validatePassword(this.data.password))
            throw '错误的用户名或密码';

        var permissions = yield s.getPermissions();
        var pc = [];
        permissions.forEach(function(p) {
            pc.push(p.code);
        });

        token = app.util.misc.createToken(s.get('username'), 7 * 24, app.config.secretKey);

        this.body = {
            'success': true,
            'token': {
                'token': token,
                'exp': exp,
                'student': {
                    'id': s.get('id'),
                    'username': s.get('username'),
                    'grade': s.grade,
                    'permissions': pc,
                }
            }

        };
    });
    return router;
};
