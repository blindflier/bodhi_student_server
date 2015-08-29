module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'gongxiu';

    var Course = require('./course')(app);
    var Grade = require('../../basic-info/models/grade')(app);

    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var Gongxiu = app.db.define(model_name, {
        holding_time: { 
            type: Sequelize.DATE,
            allowNull: false
        },
        location: { 
            type: Sequelize.STRING,
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

    Gongxiu.belongsTo(Grade);
    Grade.hasMany(Gongxiu);

    Gongxiu.belongsTo(Course);
    Course.hasMany(Gongxiu);


    return Gongxiu;
};
