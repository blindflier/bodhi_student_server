module.exports = function(app) {
  var Sequelize = require('sequelize');
  var model_name = 'students';
  if (app.db.isDefined(model_name))
    return app.db.model(model_name);

  var Grade = require('./grade')(app);
  var Student = app.db.define(model_name, {

    student_id: { //学号
      type: Sequelize.STRING,
      allowNull: false,
      unqiue: true
    },
   
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },

    grade_id: {
      type: Sequelize.INTEGER //就读班级
    },

    state: {
      type: Sequelize.INTEGER,
      /* 0:正常 1:休学 2:退学*/
      defaultValue: 0
    },
    name: {
      type: Sequelize.STRING, //姓名
      allowNull: false
    },

    bud_name: Sequelize.STRING, //法名  
    gender: {
      type: Sequelize.BOOLEAN,
      defaultValue: true
    }, //female: false , male: true,

    phone: Sequelize.STRING,
  
    email: {
      type: Sequelize.STRING
    },
    birthday: Sequelize.DATE,
    education: Sequelize.STRING,
    address: Sequelize.STRING

  }, {
    freezeTableName: true,
    underscored: true
  });

  Student.belongsTo(Grade, {
    onDelete: 'RESTRICT' //禁止删除有学员的班级
  });
  Grade.hasMany(Student);

  return Student;
}
