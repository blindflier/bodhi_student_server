process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var Student = require('../../../basic-info/models/student')(app);
var students = require('../fixtures/students');

var Role = require('../../models/Role')(app);
var roles = require('../fixtures/roles');


var Permission = require('../../models/permission')(app);
var permissions = require('../fixtures/permissions');

var StudentsRoles = require('../../models/student_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);


var _ = require('lodash');



describe('Student Role Permission assoication', function() {


  before(function(done) {    
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Promise.all([
          Student.sync({
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
      .then(function() {
        return Promise.all([Student.bulkCreate(students),
          Permission.bulkCreate(permissions),
          Role.bulkCreate(roles)
        ]);
      })
     
    .then(function() {
      done();
    });

  });

    
    it('roles should associate permissions', function(done) {
        var permissions;
        var roles ;
        Permission.findAll()
        .then(function(p){
            permissions = p;
            return Role.findAll();
        })
        .then(function(r){
            var pm = [];
            roles = r;
            roles.forEach(function(r){
                pm.push(r.addPermissions(permissions));
            });
            return Promise.all(pm);
        })
        .then(function(){
          return Role.findOne({name:'admin'});
        })
        .then(function(r){
           return r.getPermissions()
           .then(function(p){    
            expect(p.length).to.equal(permissions.length);  
             done();  
           });
        });

    });


    it('student should associate role', function(done) {
        var student;
        Role.findAll()
        .then(function(roles){
           Student.findOne({id:1})
           .then(function(s){
                student = s;
               return student.addRoles(roles);
           })
           .then(function(){
              return student.getPermissions();
           })
           .then(function(p){
               //console.log(p);
               done();
           });
        });
    });



});
