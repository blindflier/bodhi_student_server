var bodyParse = require('co-body');
var querystring = require('querystring');

module.exports = function(app) {


  app.use(function*(next) {

    var url = require('url').parse(this.request.url);
    
    this.data = {};

    if (url.query){
      //console.log(querystring.parse(url.query));
      this.data = querystring.parse(url.query);
    }
    if (this.request.type){
      //console.log('query type=' + this.request.type);
      this.data = yield bodyParse(this);
    }

    yield next;
  });

  return app;
}
