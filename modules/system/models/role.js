module.exports = function(app) {
  var Sequelize = require('sequelize');
  var model_name = 'roles';
  if (app.db.isDefined(model_name))
    return app.db.model(model_name);

  var User = require('./user')(app);
  var Permission = require('./permission')(app);

  var Role = app.db.define(model_name, {
    name: { 
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    desc: {
      type: Sequelize.STRING
    }
  }, {
    freezeTableName: true,
    timestamps: false,
    underscored: true

  });

  Role.belongsToMany(User,{through:'users_roles'});
  User.belongsToMany(Role,{through:'users_roles'});

  Role.belongsToMany(Permission,{through:'roles_permissions'});
  Permission.belongsToMany(Role,{through:'roles_permissions'});
  return Role;
};
