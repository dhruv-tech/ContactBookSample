/* 
    Tesing the REST API
*/

const build = require('../app');
const app = build();
require('dotenv').config();

const request = require('supertest');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose);

before(async function () {
    this.timeout(5000);
    await app.ready();
    await mockgoose.prepareStorage();
    await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });
})

describe('UNIVERSAL: Basic Auth',  async() => {

    it ('Contains valid credentials', () => {

        return request(app.server).post('/v1/contacts').send({})
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.statusCode).to.not.equal(401);
        });

    });

    it ('Contains invalid credentials', () => {

        return request(app.server).post('/v1/contacts').send({})
        .set('Content-Type', 'application/json')
        .auth('admin', 'admin')
        .expect(401);

    });

});

describe('POST: /v1/contacts',  async() => {

    it ('Contains valid request', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "Person",
            "lastName": "1",
            "email": "person1@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(201);

    });

    it ('Contains valid request, same name but different email as last test', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "Person",
            "lastName": "1",
            "email": "personone@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(201);

    });

    it ('Contains valid request, same name (mixed-case) but different email as last test', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "peRson",
            "lastName": "1",
            "email": "person.one@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(201);

    });

    it ('Contains duplicate email id (mixed-case)', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "People",
            "lastName": "One",
            "email": "persOn1@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(406);

    });

    it ('Contains invalid email id', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "People",
            "lastName": "One",
            "email": "person1human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

    it ('Contains inadequate data', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "People",
            "email": "person1@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

    it ('Contains null email id', () => {

        return request(app.server).put('/v1/contacts/person10@human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": null
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

});

describe('PUT: /v1/contacts/:email',  async() => {

    it ('Contains valid request', () => {
        return request(app.server).put('/v1/contacts/person1@human.life').send({
            "firstName": "Person",
            "lastName": "One",
            "email": "person1@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(204);

    });

    it ('Contains duplicate email id in body', () => {

        return request(app.server).put('/v1/contacts/person1@human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": "personone@human.life"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(406);

    });

    it ('Contains duplicate email id (mixed-case)', () => {

        return request(app.server).post('/v1/contacts').send({
            "firstName": "People",
            "lastName": "One",
            "email": "PERSON1@human.LIFE"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(406);

    });

    it ('Contains invalid email id in body', () => {

        return request(app.server).put('/v1/contacts/person1@human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": "person1@human"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

    it ('Contains invalid email id in params', () => {

        return request(app.server).put('/v1/contacts/person1human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": "person1@human.xyz"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(404);

    });

    it ('Contains non-existant email id in body', () => {

        return request(app.server).put('/v1/contacts/person10@human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": "person1@human"
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

    it ('Contains null email id in body', () => {

        return request(app.server).put('/v1/contacts/person10@human.life').send({
            "firstName": "People",
            "lastName": "One",
            "email": null
        }).set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);

    });

});

describe('GET: /v1/contacts/:page/:query',  async() => {

    it ('Contains valid request - all contacts', () => {
        return request(app.server).get('/v1/contacts/1/').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(3);
        })
    
    });

    it ('Contains valid request - search by email', () => {
        return request(app.server).get('/v1/contacts/1/person1@human.life').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].email).to.equal('person1@human.life');
        })
    
    });

    it ('Contains valid request - search by first name (mixed-case)', () => {
        return request(app.server).get('/v1/contacts/1/PersoN').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(3);
            expect(res.body[0].firstName).to.equal('Person');
            expect(res.body[1].firstName).to.equal('Person');
            expect(res.body[2].firstName).to.equal('peRson');
        })
    
    });

    it ('Contains valid request - search by last name (mixed-case)', () => {
        return request(app.server).get('/v1/contacts/1/oNe').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].lastName).to.equal('One');
        })
    
    });

    it ('Contains valid request - search by full name (mixed-case)', () => {
        return request(app.server).get('/v1/contacts/1/PersoN oNe').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(1);
            expect(res.body[0].firstName).to.equal('Person');
            expect(res.body[0].lastName).to.equal('One');
        })
    
    });

    it ('Contains inavlid page number (<1)', () => {
        return request(app.server).get('/v1/contacts/0/').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);
    
    });

    it ('Contains invalid page number (string)', () => {
        return request(app.server).get('/v1/contacts/all/').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(400);
    
    });
    
    it ('Contains valid request - empty page', () => {
        return request(app.server).get('/v1/contacts/2/').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(0);
        })
    
    });

    it ('Contains valid request - 1st page should have only 10 records (relies on POST)', async() => {

        return new Promise(async(resolve) => {
            let count = 0;
            while (count < 12) {
                await request(app.server).post('/v1/contacts').send({
                    "firstName": "Human",
                    "lastName": `${count}`,
                    "email": `human${count}@person.life`
                }).set('Content-Type', 'application/json')
                .auth(process.env.USR, process.env.PSWD);

                count++;
            }

            request(app.server).get('/v1/contacts/1/human').send()
            .set('Content-Type', 'application/json')
            .auth(process.env.USR, process.env.PSWD)
            .then((res) => {
                expect(res.body.length).to.equal(10);
                resolve();
            })
        })
    
    });

    it ('Contains valid request - 2nd page should have only 2 records (relies on previous test)', async() => {

        return request(app.server).get('/v1/contacts/2/human').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .then((res) => {
            expect(res.body.length).to.equal(2);
        })
    
    });

});

describe('DELETE: /v1/contacts/:page/:email',  async() => {

    it ('Contains valid request', () => {
        return request(app.server).delete('/v1/contacts/person1@human.life').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(204);
    });

    it ('Contains non-existent email', () => {
        return request(app.server).delete('/v1/contacts/person1@human.com').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(404);
    });

    it ('Contains no email', () => {
        return request(app.server).delete('/v1/contacts/').send()
        .set('Content-Type', 'application/json')
        .auth(process.env.USR, process.env.PSWD)
        .expect(404);
    });

});

describe('CHECKSUM',  async() => {

    it ('There should be 14 reocrds', () => {
        return new Promise(async(resolve) => {
            let sum = 0;
            request(app.server).get('/v1/contacts/1/').send()
            .set('Content-Type', 'application/json')
            .auth(process.env.USR, process.env.PSWD).then((res1) => {
                sum += res1.body.length;

                request(app.server).get('/v1/contacts/2/').send()
                .set('Content-Type', 'application/json')
                .auth(process.env.USR, process.env.PSWD).then((res2) => {
                    sum += res2.body.length;
                    expect(sum).to.equal(14);
                    resolve();
                });
            });

        });
        
    });

});

after(function () {
    app.close()
    mongoose.connection.close()
});