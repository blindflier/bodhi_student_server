module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'permissions';
    if (app.db.isDefined(model_name))
      return app.db.model(model_name);

    var Permission = app.db.define(model_name, {
       name: { //显示名称
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      code: { //代号
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      desc: {
        type: Sequelize.STRING
      },
    }, {
      freezeTableName: true,
      timestamps: false,
      underscored: true

    });

    return Permission;
};