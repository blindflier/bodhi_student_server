module.exports = function(app) {
  var Sequelize = require('sequelize');
  var model_name = 'grades';
  if (app.db.isDefined(model_name))
    return app.db.model(model_name);

  var Grade = app.db.define(model_name, {
    code: { //代号
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: 'city-seq'
    },
    genre: {
      type: Sequelize.STRING,
      allowNull: false
    },

    seq: {
      type: Sequelize.INTEGER.UNSIGNED, //编号
      allowNull: false,
      unique: 'city-seq'
    }
  }, {
    freezeTableName: true,
    underscored: true
  });

  return Grade;

}
