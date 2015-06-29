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
        classMethods: {
            setUsers: function(role_id, users) {
                var self = this;
                var sql = "insert into users_roles (user_id,role_id) values ";
                var val = [];
                users.forEach(function(u) {
                    val.push('(' + u.id + ',' + role_id + ')');
                });
                sql = sql + val.join(',');
                return app.db.query(sql, {
                    type: Sequelize.QueryTypes.INSERT
                });
            },
            setPermissions: function(role_id, permissions) {
                var self = this;
                var sql = "insert into roles_permissions (permission_id,role_id) values ";
                var val = [];
                permissions.forEach(function(p) {
                    val.push('(' + p.id + ',' + role_id + ')');
                });
                sql = sql + val.join(',');
                return app.db.query(sql, {
                    type: Sequelize.QueryTypes.INSERT
                });
            }
        },
        freezeTableName: true,
        timestamps: false,
        underscored: true

    });

    Role.belongsToMany(User, {
        through: 'users_roles'
    });
    User.belongsToMany(Role, {
        through: 'users_roles'
    });

    Role.belongsToMany(Permission, {
        through: 'roles_permissions'
    });
    Permission.belongsToMany(Role, {
        through: 'roles_permissions'
    });
    return Role;
};
