var util = require('util');

var EventEmitter = require('events').EventEmitter;

function Helper(app, router, model) {
    EventEmitter.call(this);
    this.app = app;
    this.router = router;
    this.model = model;
}

util.inherits(Helper, EventEmitter);
module.exports = Helper;



Helper.prototype.create = function(permissions) {
    var self = this;
    self.router.post('/api/' + self.model.name, function*(next) {

        if (!this.student.permissions.contains(permissions))
            this.throw(403);

        var options = {};
        self.emit('create', options, this.data);
        var c = yield self.model.create(this.data, options);
        self.emit('afterCreate', c, options, this.data);
        this.body = {
            success: true,
            data: c
        };
    });

};
Helper.prototype.read = function(permissions) {

    var self = this;
    this.router.get('/api/' + self.model.name, function*(next) {

        if (!this.student.permissions.contains(permissions))
            this.throw(403);

        var data = this.data;

        var options = {
            where: {}
        };

        if (data.offset)
            options.offset = data.offset;

        if (!data.limit)
            options.limit = 1;
        else {
            if (data.limit !== 'all')
                options.limit = data.limit;
        }

        options.order = data.order || 'id ASC';

        self.emit('read', options, data);

        var res = yield self.model.findAndCountAll(options);

        self.emit('afterRead', res);
        this.body = {
            'success': true,
            'total': res.count,
            'data': res.rows
        };
    });

};


Helper.prototype.update = function(permissions) {
    var self = this;
    this.router.put('/api/' + self.model.name + '/:id', function*(next) {

        if (!this.student.permissions.contains(permissions))
            this.throw(403);

        var options = {
            'where': {
                id: this.params.id
            }
        };
        var m = yield self.model.findOne(options);
        if (!m && m.update)
            this.throw('bad id',500);
        options = {};
        var c = yield m.update(this.data, {});
        this.body = {
            success: !!c
        };
    });
};

Helper.prototype.destroy = function(permissions) {
    var self = this;
    this.router.delete('/api/' + self.model.name + '/:id', function*(next) {
        if (!this.student.permissions.contains(permissions))
            this.throw(403);

        var r = yield self.model.destroy({
            'where': {
                id: this.params.id
            }
        });
        this.body = {
            success: !!r
        };
    });
}

Helper.prototype.readOne = function(permissions) {
    var self = this;
    this.router.get('/api/' + self.model.name + '/:id', function*(next) {

        if (!this.student.permissions.contains(permissions))
            this.throw(403);

        var options = {
            'where': {
                id: this.params.id
            }
        };
        self.emit('readOne', options);

        var s = yield self.model.findOne(options);
        
        self.emit('afterReadOne', s);
        if (s)
            this.body = {
                'success': true,
                'data': s
            };
        else
            this.body = {
                'success': false
            };
    });
};

Helper.prototype.crud = function(permissions) {
    permissions = permissions || {};
    this.create(permissions.create || permissions['default']);
    this.readOne(permissions.readOne || permissions['default']);
    this.read(permissions.read || permissions['default']);
    this.update(permissions.update || permissions['default']);
    this.destroy(permissions.destroy || permissions['default']);
};
