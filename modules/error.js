module.exports = function(app) {

  app.use(function*(next) {
  
    try {
      yield next;
    } catch (e) {
      if (process.env.NODE_ENV !== 'production'){
        console.log(e);
      }
      this.status = 200;
      this.body = {
          'success': false,
          'error': e.message || e
        }
    }
  });
  return app;
}
