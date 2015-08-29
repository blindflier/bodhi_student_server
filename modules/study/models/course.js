module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'courses';
    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var Course = app.db.define(model_name, {
        category: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: 'category-seq'
        },
        seq: {
            type: Sequelize.INTEGER.UNSIGNED, //序号
            allowNull: false,
            unique: 'category-seq'
        },
        subject: { //主题
            type: Sequelize.STRING,
            allowNull: false
        },
        desc: { //备注
            type: Sequelize.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false,
        underscored: true

    });

    return Course;
};
