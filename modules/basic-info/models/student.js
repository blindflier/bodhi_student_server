module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'students';
    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var Grade = require('./grade')(app);
    var Student = app.db.define(model_name, {

        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        salt: {
            type: Sequelize.STRING,
            allowNull: false
        },
        hashed_password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.VIRTUAL,
            set: function(val) {
                val = val || '';
                if (!val.length || val.length < 6)
                    return;
                var salt = this.getDataValue('salt');
                if (!salt) {
                    salt = app.util.crypto.randomString(6);
                    this.setDataValue('salt', salt);
                }
                var hashed_password = app.util.crypto.makeHashedPassword(val, salt);
                this.setDataValue('hashed_password',
                    hashed_password
                );
                //console.log(this.dataValues);
                //console.log(this._previousDataValues);
            }
        },


        student_number: { //学号
            type: Sequelize.STRING,
            allowNull: false,
            unqiue: true
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
            allowNull: false,
            unique: 'name-bud-name'
        },

        bud_name: {
            type: Sequelize.STRING, //法名  
            unique: 'name-bud-name'
        },
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
        instanceMethods: {
            validatePassword: function(password) {
                return this.getDataValue('hashed_password') ==
                    app.util.crypto.makeHashedPassword(password, this.getDataValue('salt'));
            },

            getPermissions: function() {
                var sql = "select distinct p.* from students s left join students_roles sr on s.id=sr.student_id " +
                    "left join roles r on sr.role_id=r.id left join roles_permissions rp on r.id=rp.role_id " +
                    "left join permissions p on rp.permission_id=p.id where s.id=" + this.get('id');
                return app.db.query(sql, {
                    type: Sequelize.QueryTypes.SELECT
                });
            },

            sanitize: function() {
                this.setDataValue('salt', undefined);
                this.setDataValue('hashed_password', undefined);
            }

        },
        freezeTableName: true,
        underscored: true
    });

    Student.belongsTo(Grade, {
        onDelete: 'RESTRICT' //禁止删除有学员的班级
    });
    Grade.hasMany(Student);

    return Student;
}
