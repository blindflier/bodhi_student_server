process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var User = require('../../models/user')(app);
var users = require('../fixtures/users');

var Role = require('../../models/Role')(app);
var roles = require('../fixtures/roles');


var Permission = require('../../models/permission')(app);
var permissions = require('../fixtures/permission');

var UsersRoles = require('../../models/user_role')(app);
var RolesPermissions = require('../../models/role_permission')(app);


var _ = require('lodash');

var request = require('supertest');


describe('User Role Permission assoication', function() {


  before(function(done) {

 
    
    app.db.query('SET FOREIGN_KEY_CHECKS = 0')
      .then(function() {
        return Promise.all([
          User.sync({
            force: true
          }), Permission.sync({
            force: true
          }), Role.sync({
            force: true
          }),
          UsersRoles.sync({
            force: true
          }), RolesPermissions.sync({
            force: true
          })
        ]);
      })
      .then(function() {
        return Promise.all([User.bulkCreate(users),
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
           })
        });

    });


    it('user should associate role', function(done) {
        var user;
        Role.findAll()
        .then(function(roles){
           User.findOne({name:'a'})
           .then(function(u){
                user = u;
               return u.addRoles(roles);
           })
           .then(function(){
              return user.getPermissions();
           })
           .then(function(p){
               //console.log(p);
               done();
           });
        });
    });



});
