#!/usr/local/bin/node

process.NODE_ENV = process.NODE_ENV || 'development';

var app = require('../app');
var Sequelize = require('sequelize');
var argv = require('yargs').argv;
var util = require('util');


var fs = require('fs');
var globby = require('globby');

var path = require('path'),
  rootPath = path.normalize(__dirname + '/..');


var cmd = argv._[0];
var model = argv._[1];

//载入controller类
var model_path = rootPath + '/modules/*/models/'+model + '.js';
//console.log(model_path);
var model_file = globby.sync([model_path]);

if (model_file.length === 1)
    model = require(model_file[0])(app);
else{
    app.db.close();
    return console.log('can not find model name' + model_file);
}


var id = argv.i;
var data = argv.d;

var commands = {};

var file_data;

if (argv.f)
    file_data = require(argv.f);

data = file_data || data;
if (typeof data === 'string')
    data = JSON.parse(data);


commands.add = function(id, data) {
    if (!data)
        return console.log('参数格式错误');

    model.sync()
        .then(function() {
            if (!util.isArray(data)) {
                return model.create(data);
            } else {
                return app.db.query('SET FOREIGN_KEY_CHECKS = 0')
                    .then(function() {
                        return model.bulkCreate(data);
                    });
            }
        })
        .then(function() {
            console.log('success');
            app.db.close();
        });


};


commands.update = function(id, data) {
    if (!id) {
        return console.log('参数格式错误');
    }

    model.update(data, {
            'where': {
                id: id
            }
        })
        .then(function() {
            console.log('success');
            app.db.close();
        });

};

commands.show = function() {
    model.sync()
        .then(function() {
            return model.findAll();
        })
        .then(function(models) {
            models.forEach(function(p) {
                console.log(p.toJSON());
            });

            app.db.close();
        });
};

commands.truncate = function() {
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
        .then(function() {
            return model.destroy({
                truncate: true
            });
        })
        .then(function() {
            console.log('success');
            app.db.close();
        });
};


switch (cmd) {
    default: if (typeof commands[cmd] === 'function')
            commands[cmd](id, data);
        else
            console.log('unknown command');
    break;
}
