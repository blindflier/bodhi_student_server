process.env.NODE_ENV = 'test';
var app = require('../../../../app');
var students = require('../fixtures/students');
var roles = require('../fixtures/roles');
var permissions = require('../fixtures/permissions');


var Role = require('../../models/role')(app);
var Student = require('../../../basic-info/models/student')(app);
var Permission = require('../../models/permission')(app);
var StudentsRoles = require('../../models/student_role')(app);
var RolesPermssions = require('../../models/role_permission')(app);
var expect = require('chai').expect;

describe('Role Model', function() {

    before(function(done) {
        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Permission.sync({
                    force: true
                });
            })
            .then(function() {
                return Student.sync({
                    force: true
                });
            })
            .then(function() {
                return Role.sync({
                    force: true
                });
            })
            .then(function() {
                return RolesPermssions.sync({
                    force: true
                });
            })
            .then(function() {
                return StudentsRoles.sync({
                    force: true
                });
            })
            .then(function() {
                done();
            });
    });

    describe('create roles', function() {

        it('should create valid roles', function(done) {
            var p;
            var role;
            var student;
            Permission.create(permissions[0])
                .then(function(ret) {
                    p = ret;
                    //console.dir(p);
                    return Role.create(roles[0]);
                })
                .then(function(ret) {
                    role = ret;
                    expect(roles[0].name).to.equal(role.name);
                    return Student.create(students[0]);
                })
                .then(function(ret) {
                    student = ret;
                    return role.addPermission(p);
                })
                .then(function(ret) {
                    return role.addStudent(student);
                })
                .then(function() {
                    done();
                });
        });
    });


    describe('roles set students  ', function() {

        it('should set students', function(done) {

            Role.setStudents(1, students)
                .then(function(ret) {
                    done();
                });

        });
    });

    describe('roles add students  ', function() {

        it('should add students', function(done) {
       
            var role;
               Role.findOne({
                    id: 1
                })
                .then(function(r) {
                    role = r;
                    return StudentsRoles.destroy({
                        'where': {
                            'role_id' : role.id
                        }
                    });
                })
                .then(function(){
                   return Student.destroy({truncate:true});
                })
                 .then(function() {
                    return Student.bulkCreate(students);
                })
                .then(function(){
                    return Student.findAll();
                })
                .then(function(students) {
                    //console.log(students);
                    return role.addStudents(students);
                })
                .then(function(ret) {
                    done();
                });

        });
    });

    describe('roles set permissions  ', function() {

        it('should set permissions', function(done) {

            Role.setPermissions(1, permissions)
                .then(function(ret) {
                    done();
                });

        });
    });

});
