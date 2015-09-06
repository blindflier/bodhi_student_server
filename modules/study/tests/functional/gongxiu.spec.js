process.env.NODE_ENV = 'test';

var app = require('../../../../app');

//var BBPromise = require('bluebird');

var should = require('chai').should();
var expect = require('chai').expect;

var Gongxiu = require('../../models/gongxiu')(app);
var Checkin = require('../../models/checkin')(app);
var gongxiu = require('../fixtures/gongxiu');
var checkins = require('../fixtures/checkins');

var _ = require('lodash');

var request = require('supertest');

var token = app.util.misc.createToken('admin', 1, app.config.secretKey);

var studentToken = app.util.misc.createToken('student', 1, app.config.secretKey);



describe('Gongxiu Controller', function() {


    before(function(done) {

        app.db.query('SET FOREIGN_KEY_CHECKS = 0')
            .then(function() {
                return Gongxiu.sync({
                    force: true
                });

            })
            .then(function() {
                return require('../../../system/tests/fixtures/prepare_permission')();
            })

        .then(function(c) {

            done();
        });

    });


    describe('add gongxiu', function() {


        var i = 0;
        gongxiu.forEach(function(p) {
            it('should add gongxiu success ' + (++i), function(done) {
                request(app.listen()).post('/api/gongxiu')
                    .send(p)
                    .set('jwt-token', token)
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

            it('should not add gongxiu success ' + i + ' with bad token', function(done) {
                request(app.listen()).post('/api/gongxiu')
                    .send(p)
                    .set('jwt-token', studentToken)
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

    describe('get gongxiu', function() {
        it('should get courses', function(done) {
            request(app.listen()).get('/api/gongxiu')
                .expect(200)
                .set('jwt-token', studentToken)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    console.log(res.body);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

    });

    describe('set gongxiu checkin', function() {
        before(function(done) {
            app.db.query('SET FOREIGN_KEY_CHECKS = 0')
                .then(function() {
                    return Checkin.sync({
                        force: true
                    });
                })
                .then(function() {
                    done();
                });
        });

        it('should set gongxiu checkin', function(done) {
            request(app.listen()).post('/api/gongxiu/1/checkin')
                .expect(200)
                .send({'checkins': checkins})
                .set('jwt-token', token)
                .end(function(err, res) {
                    if (err)
                        throw err;
                    console.log(res.body);
                    expect(res.body.success).to.be.true;
                    done();
                });
        });

    });

    describe('read gongxiu checkin', function() {
        it('should read gongxiu checkin', function(done) {
            request(app.listen()).get('/api/gongxiu/1/checkin')
                .expect(200)
                .set('jwt-token', token)
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
