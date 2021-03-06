const path = require('path');
const fs = require('fs-extra');
const should = require('should');
const supertest = require('supertest');
const localUtils = require('./utils');
const testUtils = require('../../../utils');
const config = require('../../../../server/config');

const ghost = testUtils.startGhost;

describe('Images API', function () {
    const images = [];
    let request;

    before(function () {
        return ghost()
            .then(function () {
                request = supertest.agent(config.get('url'));
            })
            .then(function () {
                return localUtils.doAuth(request);
            });
    });

    after(function () {
        images.forEach(function (image) {
            fs.removeSync(config.get('paths').appRoot + image);
        });
    });

    it('Can upload a png', function (done) {
        request.post(localUtils.API.getApiQuery('images'))
            .set('Origin', config.get('url'))
            .expect('Content-Type', /json/)
            .attach('uploadimage', path.join(__dirname, '/../../../utils/fixtures/images/ghost-logo.png'))
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.body.url.should.match(new RegExp(`${config.get('url')}/content/images/\\d+/\\d+/ghost-logo.png`));

                images.push(res.body.url.replace(config.get('url'), ''));
                done();
            });
    });

    it('Can upload a jpg', function (done) {
        request.post(localUtils.API.getApiQuery('images'))
            .set('Origin', config.get('url'))
            .expect('Content-Type', /json/)
            .attach('uploadimage', path.join(__dirname, '/../../../utils/fixtures/images/ghosticon.jpg'))
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.body.url.should.match(new RegExp(`${config.get('url')}/content/images/\\d+/\\d+/ghosticon.jpg`));

                images.push(res.body.url.replace(config.get('url'), ''));
                done();
            });
    });

    it('Can upload a gif', function (done) {
        request.post(localUtils.API.getApiQuery('images'))
            .set('Origin', config.get('url'))
            .expect('Content-Type', /json/)
            .attach('uploadimage', path.join(__dirname, '/../../../utils/fixtures/images/loadingcat.gif'))
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.body.url.should.match(new RegExp(`${config.get('url')}/content/images/\\d+/\\d+/loadingcat.gif`));

                images.push(res.body.url.replace(config.get('url'), ''));
                done();
            });
    });

    it('Can upload a square profile image', function (done) {
        request.post(localUtils.API.getApiQuery('images/profile-image'))
            .set('Origin', config.get('url'))
            .expect('Content-Type', /json/)
            .attach('uploadimage', path.join(__dirname, '/../../../utils/fixtures/images/loadingcat_square.gif'))
            .expect(201)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }

                res.body.url.should.match(new RegExp(`${config.get('url')}/content/images/\\d+/\\d+/loadingcat_square.gif`));

                images.push(res.body.url.replace(config.get('url'), ''));
                done();
            });
    });
});
