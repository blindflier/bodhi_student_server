process.env.NODE_ENV = 'test';

var app = require('../../../../app');

var Student = require('../../../basic-info/models/student')(app);

var Role = require('../../models/Role')(app);
var Permission = require('../../models/permission')(app);
var StudentsRoles = require('../../models/student_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);


var roles = require('./roles');
var permissions = require('./permissions');
var students = require('./students');


module.exports = function(){
  return app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Promise.all([Student.sync({
                        force: true
                    }), Permission.sync({
                        force: true
                    }), Role.sync({
                        force: true
                    }),
                    StudentsRoles.sync({
                        force: true
                    }), RolesPermissions.sync({
                        force: true
                    })
                ]);
            })
 .then(function(){
   //create students
   return Student.bulkCreate(students);
 })
 .then(function(){
   //create permissions
   return Permission.bulkCreate(permissions);
 })
 .then(function(){
   //create roles
   return Role.bulkCreate(roles);
 })
 .then(function(){
   //association roles and students and permissions
   var pm = [];
   roles.forEach(function(r){
        pm.push(Role.setStudents(r.id,r.students));
        pm.push(Role.setPermissions(r.id,r.permissions));
   });
   return Promise.all(pm);
 });
};

