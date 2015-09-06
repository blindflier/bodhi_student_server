module.exports = function(app) {
    var Sequelize = require('sequelize');
    var model_name = 'roles';
    if (app.db.isDefined(model_name))
        return app.db.model(model_name);

    var Student = require('../../basic-info/models/student')(app);
    var Permission = require('./permission')(app);
    var Student_Role = require('./student_role')(app);
    var Role_Permission = require('./role_permission')(app);
  
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
            setStudents: function(role_id, students) {

                var sql = "insert into students_roles (student_id,role_id) values ";
                var val = [];

                var p = Student_Role.destroy({
                    'where': {
                        'role_id': role_id
                    }
                });

                if (students && students.length > 0) {
                    students.forEach(function(s) {
                        val.push('(' + s.id + ',' + role_id + ')');
                    });
                    sql = sql + val.join(',');
                    return p.then(function() {
                        return app.db.query(sql, {
                            type: Sequelize.QueryTypes.INSERT
                        });
                    });
                } else
                    return p;



            },
            setPermissions: function(role_id, permissions) {
                var self = this;
                var sql = "insert into roles_permissions (permission_id,role_id) values ";
                var val = [];

                var p = Role_Permission.destroy({
                    'where': {
                        'role_id': role_id
                    }
                });

                if (permissions && permissions.length > 0) {

                    permissions.forEach(function(p) {
                        val.push('(' + p.id + ',' + role_id + ')');
                    });
                    sql = sql + val.join(',');

                    return p.then(function(err) {
                        return app.db.query(sql, {
                            type: Sequelize.QueryTypes.INSERT
                        });
                    });
                } else
                    return p;
            }
        },
        freezeTableName: true,
        timestamps: false,
        underscored: true

    });

    Role.belongsToMany(Student, {
        through: 'students_roles'
    });
    Student.belongsToMany(Role, {
        through: 'students_roles'
    });

    Role.belongsToMany(Permission, {
        through: 'roles_permissions'
    });
    Permission.belongsToMany(Role, {
        through: 'roles_permissions'
    });
    return Role;
};
