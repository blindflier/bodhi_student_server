module.exports = function(app) {

    var jwt = require('jsonwebtoken');
    //var User = require('./system/models/user')(app);
    var Student = require('./basic-info/models/student')(app);
    var Grade = require('./basic-info/models/grade')(app);
    var _ = require('lodash');

    app.use(function*(next) {
        var token, permissions;
        var self = this;
        try {
            token = jwt.verify(this.req.headers['jwt-token'], app.config.secretKey);
        } catch (err) {
            if (this.path !== '/api/token') {
                this.throw(403);
            } else
                return yield next;
        }

        //console.log(token);

        this.student = yield Student.findOne({
            'where': {
                'username': token.iss
            },
            'include': [{
                model: Grade
            }]
        });


        if (this.student) {
            permissions = yield this.student.getPermissions();
            this.student.permissions = _.map(permissions,function(p){
               return p.code;
            });
        } else{
            var c = yield Student.count();
            if (c == 0){
              this.student = {
                'permissions' : ['SUPER_ADMIN']
              };
            }else{
              console.log(token);
              console.log('has user 403');
              this.throw(403);
            }
        }


        console.log(this.student.permissions);

        this.student.permissions.contains = function(permissions){
          permissions = permissions || [];

          return ( _.includes(self.student.permissions,'SUPER_ADMIN') ||
                   permissions.length === 0 || 
                  _.intersection(self.student.permissions,permissions).length > 0);
        };
        yield next;
    });

}
