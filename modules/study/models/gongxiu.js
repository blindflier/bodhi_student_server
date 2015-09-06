module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'gongxiu';

    var Course = require('./course')(app);
    var Checkin = require('./checkin')(app);
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
        classMethods: {
            setCheckins: function(gid,checkins) {

                checkins.forEach(function(ck) {

                    if (ck.gongxiu_id && ck.gongxiu_id != gid)
                        throw 'error gongxiu id';
                    else
                        ck.gongxiu_id = gid;
                });


                var p = Checkin.destroy({
                    where: {
                        'gongxiu_id': gid
                    }
                });
                if (checkins && checkins.length > 0)
                    return p.then(function() {
                        return Checkin.bulkCreate(checkins); 
                    });
                else
                    return p;
                // return new Promise(function(resolve,reject){
                //     resolve(true);
                // });
            }
        },
        freezeTableName: true,
        timestamps: false,
        underscored: true

    });

    Gongxiu.belongsTo(Grade);
    Grade.hasMany(Gongxiu);

    Gongxiu.belongsTo(Course);
    Course.hasMany(Gongxiu);

    Checkin.belongsTo(Gongxiu);
    Gongxiu.hasMany(Checkin);

    return Gongxiu;
};
