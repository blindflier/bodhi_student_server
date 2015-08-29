module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'users';

    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var User = app.db.define(model_name, {
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
        }
    }, {
        instanceMethods: {
            validatePassword: function(password) {
                return this.getDataValue('hashed_password') ==
                    app.util.crypto.makeHashedPassword(password, this.getDataValue('salt'));
            },

            getPermissions: function() {
                var sql = "select distinct p.* from users u left join users_roles ur on u.id=ur.user_id " +
                    "left join roles r on ur.role_id=r.id left join roles_permissions rp on r.id=rp.role_id " +
                    "left join permissions p on rp.permission_id=p.id where u.id=" + this.get('id');
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
        timestamps: false,
        underscored: true

    });

    var Student = require('../../basic-info/models/student')(app);
    User.belongsTo(Student);
    return User;
};
