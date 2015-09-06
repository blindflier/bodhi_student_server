process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var Course = require('../../models/course')(app);
var Student = require('../../../basic-info/models/student')(app);
var courses = require('../fixtures/courses');


var _ = require('lodash');

var request = require('supertest');

var token = app.util.misc.createToken('admin', 1, app.config.secretKey);

var studentToken = app.util.misc.createToken('student', 1, app.config.secretKey);



describe('Course Controller', function() {

    before(function(done) {
        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Course.sync({
                    force: true
                });

            })
            .then(function() {
                return require('../../../system/tests/fixtures/prepare_permission')();
            })
            .then(function(){
               return Student.count();
            })
            .then(function(c) {
                console.log('Student count ' +c);
                done();
            });

    });


    describe('add courses', function() {


        var i = 0;
        courses.forEach(function(p) {
            it('should add course success ' + (++i), function(done) {
                request(app.listen()).post('/api/courses')
                    .send(p)
                    .set('jwt-token',token)
                    .expect(200)
                    .end(function(err, res) {
                        console.log(err);
                        if (err)
                            throw err;
                        //console.log(res.body);
                        expect(res.body.success).to.be.true;
                        done();
                    });
            });

             it('should not add course success ' + i+ ' with bad token', function(done) {
                request(app.listen()).post('/api/courses')
                    .send(p)
                    .set('jwt-token',studentToken)
                    .expect(200)
                    .end(function(err, res) {
                        if (err)
                            throw err;
                        expect(res.body.success).to.be.false;
                         expect(res.body.error).to.exist;
                        done();
                    });
            });
        });
    });

    describe('get courses', function() {
        it('should get courses', function(done) {
            request(app.listen()).get('/api/courses')
                .expect(200)
                .set('jwt-token',studentToken)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    console.log(res.body);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

    });

});
