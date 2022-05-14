// Default settings
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');

// Use should for assert
chai.should();
chai.use(chaiHttp);

let createdMealId;

// Create the tests
describe('UC-301 Create a meal', () => {
    it('TC-301-1 Required input is missing', (done) => {
        chai.request(server)
            .post('/api/meal')
            .send({
                // name is missing
                description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2022-03-22T16:35:00.000Z',
                imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
                maxAmountOfParticipants: 4,
                price: 12.75,
                // cookId: 1,
                // createDate: '2022-02-26T17:12:40.048Z',
                // updateDate: '2022-04-26T10:33:51.000Z'
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('name must be a string!');
                done();
            });
    });
    // it('TC-301-2 Not logged in', (done) => {
    //     chai.request(server)
    //         .post('/api/meal')
    //         .send({
    //             // User is not logged in
    //             name: 'Pasta Bolognese met tomaat, spekjes en kaas',
    //             description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
    //             isActive: 1,
    //             isVega: 0,
    //             isVegan: 0,
    //             isToTakeHome: 1,
    //             dateTime: '2022-03-22T16:35:00.000Z',
    //             imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
    //             allergenes: 'gluten,lactose',
    //             maxAmountOfParticipants: 4,
    //             price: 12.75,
    //             // cookId: 1,
    //             // createDate: '2022-02-26T17:12:40.048Z',
    //             // updateDate: '2022-04-26T10:33:51.000Z'
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(401);
    //             message.should.be.a('string').that.equals('Not logged in!');
    //             done();
    //         });
    // });
    it('TC-301-3 Meal succesfully added', (done) => {
        chai.request(server)
            .post('/api/meal')
            .send({
                name: 'Pasta Bolognese met tomaat, spekjes en kaas',
                description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2022-03-22T16:35:00.000Z',
                imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
                maxAmountOfParticipants: 4,
                price: 12.75,
                // cookId: 1,
                // createDate: '2022-02-26T17:12:40.048Z',
                // updateDate: '2022-04-26T10:33:51.000Z'
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, result } = res.body;
                status.should.equals(201);
                createdMealId = result.id;
                done();
            });
    });
});

describe('UC-302 Modify meal', () => {
    it('TC-302-1 Required input is missing', (done) => {
        chai.request(server)
            .put('/api/meal/' + createdMealId)
            .send({
                // name is missing
                description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2022-03-22T16:35:00.000Z',
                imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
                maxAmountOfParticipants: 4,
                price: 12.75,
                // cookId: 1,
                // createDate: '2022-02-26T17:12:40.048Z',
                // updateDate: '2022-04-26T10:33:51.000Z'
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(400);
                message.should.be.a('string').that.equals('name must be a string!');
                done();
            });
    });
    // it('TC-302-2 Not logged in', (done) => {
    //     chai.request(server)
    //         .put('/api/meal/' + createdMealId)
    //         .send({
    //             // User is not logged in
    //             name: 'Pasta Bolognese met tomaat, spekjes en kaas',
    //             description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
    //             isActive: 1,
    //             isVega: 0,
    //             isVegan: 0,
    //             isToTakeHome: 1,
    //             dateTime: '2022-03-22T16:35:00.000Z',
    //             imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
    //             allergenes: 'gluten,lactose',
    //             maxAmountOfParticipants: 4,
    //             price: 12.75,
    //             // cookId: 1,
    //             // createDate: '2022-02-26T17:12:40.048Z',
    //             // updateDate: '2022-04-26T10:33:51.000Z'
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(401);
    //             message.should.be.a('string').that.equals('Not logged in!');
    //             done();
    //         });
    // });
    // it('TC-302-3 Not owner of the data', (done) => {
    //     chai.request(server)
    //         .put('/api/meal/' + createdMealId)
    //         .send({
    //             // Not owner of the data
    //             name: 'Pasta Bolognese met tomaat, spekjes en kaas',
    //             description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
    //             isActive: 1,
    //             isVega: 0,
    //             isVegan: 0,
    //             isToTakeHome: 1,
    //             dateTime: '2022-03-22T16:35:00.000Z',
    //             imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
    //             allergenes: 'gluten,lactose',
    //             maxAmountOfParticipants: 5,
    //             price: 12.75,
    //             // cookId: 1,
    //             // createDate: '2022-02-26T17:12:40.048Z',
    //             // updateDate: '2022-04-26T10:33:51.000Z'
    //         })
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(401);
    //             message.should.be.a('string').that.equals('Not owner of the data!');
    //             done();
    //         });
    // });
    it('TC-302-4 Meal doesnt exist', (done) => {
        chai.request(server)
            .put('/api/meal/0')
            .send({
                name: 'Pasta Bolognese met tomaat, spekjes en kaas',
                description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2022-03-22T16:35:00.000Z',
                imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
                maxAmountOfParticipants: 5,
                price: 12.75,
                // cookId: 1,
                // createDate: '2022-02-26T17:12:40.048Z',
                // updateDate: '2022-04-26T10:33:51.000Z'
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                done();
            });
    });
    it('TC-302-5 Meal succesfully modified', (done) => {
        chai.request(server)
            .put('/api/meal/' + createdMealId)
            .send({
                name: 'Pasta Bolognese met tomaat, spekjes en kaas',
                description: 'Een heerlijke klassieker! Altijd goed voor tevreden gesmikkel!',
                isActive: 1,
                isVega: 0,
                isVegan: 0,
                isToTakeHome: 1,
                dateTime: '2022-03-22T16:35:00.000Z',
                imageUrl: 'https://miljuschka.nl/wp-content/uploads/2021/02/Pasta-bolognese-3-2.jpg',
                maxAmountOfParticipants: 5,
                price: 12.75,
                // cookId: 1,
                // createDate: '2022-02-26T17:12:40.048Z',
                // updateDate: '2022-04-26T10:33:51.000Z'
            })
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(200);
                done();
            });
    });
});

describe('UC-303 Get list of all meals', () => {
    it('TC-303-1 List of all meals returned', (done) => {
        chai.request(server)
            .get('/api/meal')
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(200);
                done();
            });
    });
});

describe('UC-304 Get details of a specific meal', () => {
    it('TC-304-1 Meal doesnt exist', (done) => {
        chai.request(server)
            .get('/api/meal/0')
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                done();
            });
    });
    it('TC-304-2 Details of a specific meal returned', (done) => {
        chai.request(server)
            .get('/api/meal/' + createdMealId)
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(200);
                done();
            });
    });
});

describe('UC-305 Delete meal', () => {
    // it('TC-305-2 Not logged in', (done) => {
    //     chai.request(server)
    //         .delete('/api/meal/' + createdMealId)
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(401);
    //             message.should.be.a('string').that.equals('Not logged in!');
    //             done();
    //         });
    // });
    // it('TC-304-3 Not owner of the data', (done) => {
    //     chai.request(server)
    //         .delete('/api/meal/' + createdMealId)
    //         .end((req, res) => {
    //             res.should.be.an('object');
    //             let { status, message } = res.body;
    //             status.should.equals(401);
    //             message.should.be.a('string').that.equals('Not owner of the data!');
    //             done();
    //         });
    // });
    it('TC-304-4 Meal doesnt exist', (done) => {
        chai.request(server)
            .delete('/api/meal/0')
            .end((req, res) => {
                res.should.be.an('object');
                let { status, message } = res.body;
                status.should.equals(401);
                message.should.be.a('string').that.equals('Meal does not exist with the id of 0');
                done();
            });
    });
    it('TC-304-5 Meal has been deleted successfully', (done) => {
        chai.request(server)
            .delete('/api/meal/' + createdMealId)
            .end((req, res) => {
                res.should.be.an('object');
                let { status } = res.body;
                status.should.equals(200);
                done();
            });
    });
});
