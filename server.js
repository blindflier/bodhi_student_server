var app = require('./app');
var config = require('./util/config');
app.listen(config.port, function(err) {
    console.log('listening on port ' + config.port + ' ...');
});
module.exports =app;
