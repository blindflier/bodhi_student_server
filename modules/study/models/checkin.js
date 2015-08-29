module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'checkin';

    var Course = require('./course')(app);
    var Gongxiu = require('./gongxiu')(app);
    var Student = require('../../basic-info/models/student')(app);
    var Grade = require('../../basic-info/models/grade')(app);

    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var Checkin = app.db.define(model_name, {
        category: {
            type: Sequelize.ENUM('现场','网络','心得','补课','公差','旷课'),
            allowNull: false
        },
        memo: { //备注
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true

    });

    Checkin.belongsTo(Student);
    Student.hasMany(Checkin);

    Checkin.belongsTo(Gongxiu);
    Gongxiu.hasMany(Checkin);


    return Checkin;
};
