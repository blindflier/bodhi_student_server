var util = require('util');

var EventEmitter = require('events').EventEmitter;

function Helper() {
    EventEmitter.call(this);
}
util.inherits(Helper, EventEmitter);
module.exports = Helper;


Helper.prototype.create = function(router, model) {
    var self = this;
    router.post('/api/' + model.name, function*(next) {
        var options = {};
        self.emit('create', options, this.data);
        var c = yield model.create(this.data, options);
        self.emit('afterCreate', c,options,this.data);
        this.body = {
            success: true,
            data: c
        };
    });

};
Helper.prototype.read = function(router, model) {

    var self = this;
    router.get('/api/' + model.name, function*(next) {

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

        var res = yield model.findAndCountAll(options);

        self.emit('afterRead', res);
        this.body = {
            'success': true,
            'total': res.count,
            'data': res.rows
        };
    });

};


Helper.prototype.update = function(router, model) {
    var self = this;
    router.put('/api/' + model.name + '/:id', function*(next) {
        var options = {
            'where': {
                id: this.params.id
            }
        };
        self.emit('update', options, this.data);
        var c = yield model.update(this.data, options);

        this.body = {
            success: !!c
        };
    });
};

Helper.prototype.destroy = function(router, model) {
    router.delete('/api/' + model.name + '/:id', function*(next) {
        var r = yield model.destroy({
            'where': {
                id: this.params.id
            }
        });
        this.body = {
            success: !!r
        };
    });
}

Helper.prototype.readOne = function(router, model) {
    var self = this;
    router.get('/api/' + model.name + '/:id', function*(next) {
        var options = {
            'where': {
                id: this.params.id
            }
        };
        self.emit('readOne', options);

        var s = yield model.findOne(options);

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

Helper.prototype.crud = function(router, model) {
    this.create(router, model);
    this.readOne(router, model);
    this.read(router, model);
    this.update(router, model);
    this.destroy(router, model);
};
