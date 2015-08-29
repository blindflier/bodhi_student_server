module.exports = function(app) {

    var jwt = require('jsonwebtoken');
    var User = require('./system/models/user')(app);
    var Student = require('./basic-info/models/student')(app);
    var Grade = require('./basic-info/models/grade')(app);

    app.use(function*(next) {
        var token, permissions;
        var self = this;
        try {
            token = jwt.verify(this.req.headers['jwt-token'], app.config.secretKey);
        } catch (err) {
            if (this.path !== '/api/token') {
                this.throw(403);
            }else
                 return yield next;
        }

        if (token.isUser) {
            this.user = yield User.findOne({
                'where': {
                    'id': token.iss
                },
                'include': [{
                    model: Student,
                    include: [{
                        model: Grade
                    }]
                }]
            });
            if (this.user) {
                this.user.permissions = [];
                permissions = yield this.user.getPermissions();
                if (app.util.misc.usefulArray(permissions)) {
                    permissions.forEach(function(p) {
                        self.user.permissions.push(p.code);
                    });
                }
            } else
                this.throw(403);

            this.user.permissions.contains = function(permissions) {
                var arr = this,
                    plen = permissions.length,
                    len = this.length;
                if (plen == 0) return true;
                if (len == 0) return false;
                for (var i = 0; i < plen; i++) {
                    for (var j = 0; j < len; j++)
                        if (arr[j] === permissions[i])
                            return true;
                }
                return false;
            }
        } else {
            this.user = {
                permissions: []
            };
            this.user.student = yield Student.findOne({
                'where': {
                    'id': token.iss
                },
                'include': [{
                    model: Grade
                }]
            });
            if (!this.user.student)
                this.throw(403);
        }
        yield next;
    });

}
