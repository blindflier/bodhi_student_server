process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var Course = require('../../models/course')(app);
var courses = require('../fixtures/courses');


var _ = require('lodash');

var request = require('supertest');


describe('Course Controller', function() {


    before(function(done) {



        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Course.sync({
                    force: true
                });

            })

        .then(function() {
            done();
        });

    });


    describe('add courses', function() {

     
        var i = 0;
        courses.forEach(function(p) {
            it('should add course success ' + (++i), function(done) {
                request(app.listen()).post('/api/courses')
                    .send(p)
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
        });
    });

    describe('get courses', function() {
        it('should get courses', function(done) {
            request(app.listen()).get('/api/courses')
                .expect(200)
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
