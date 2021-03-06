var fs = require('fs');
var globby = require('globby');

function appendObject(first, second) {
    if (first && second) {
        for (var k in second) {
            if (!first[k])
                first[k] = second[k];
            else
                throw "object property " + k + " already existed";
        }
    }
}

module.exports = function(app, path) {

    if (fs.existsSync(path + '.js')) {
        return require(path + '.js')(app);
    }

    if ((fs.existsSync(path + '/index.js'))) {
        return require(path + '.js')(app);
    }

    //载入controller类
    var router_files = globby.sync([path + '/controllers/**/*.js']);
    router_files.forEach(function(f) {
        var r = require(f)(app);
        app.use(r.routes());
        app.use(r.allowedMethods());
        //载入权限表
        appendObject(app.permissions, r.permissions);
    });

    //确保数据表创建
    var pm = [];
    if (process.env.NODE_ENV !== 'test') {
        var model_files = globby.sync([path + '/models/**.js']);
        model_files.forEach(function(f) {
            var model = require(f)(app);
            pm.push(model.sync());
        });
    }
    return Promise.all(pm);
};
