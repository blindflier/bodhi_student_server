module.exports = function(app) {
  var Sequelize = require('sequelize');
  var model_name = 'users_roles';

  if (app.db.isDefined(model_name))
    return app.db.model(model_name);

  var model = app.db.define(model_name, {}, {
    freezeTableName: true,
    timestamps: false,
    underscored: true
    
  });

  return model;
};
