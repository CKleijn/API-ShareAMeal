// Default settings
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Use body-parser
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Create a database array and sort it on id
let database = 
[
    { 
        id: 0,
        firstName: 'John',
        lastName: 'Doe',
        street: 'Lovensdijkstraat 61',
        city: 'Breda',
        isActive: true,
        emailAdress: 'john.doe@server.com',
        password: 'secret',
        phoneNumber: '06 12425475'  
    },
    { 
        id: 1,
        firstName: 'Jane',
        lastName: 'Doe',
        street: 'Hogeschoollaan 32',
        city: 'Breda',
        isActive: true,
        emailAdress: 'jane.doe@server.com',
        password: 'public',
        phoneNumber: '06 87654321'  
    },
].sort(function (x, y) {
    return x.id - y.id
});

let id = 1;

// All user routes
app.route('/user')
    .get((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: database
            });
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    })
    .post((req, res) => {
        let user = req.body;
        id++;
        user = {
            id,
            ...user
        }
        database.push(user);
        res.status(201).json({
            status: 201,
            result: database
        });
        res.end();
    });

app.get('/user/profile', (req, res) => {
    if(res.statusCode >= 200 && res.statusCode <= 299) {
        res.status(200).json({
            status: 200,
            result: 'End-point not realised yet'
        });
    } else {
        res.status(401).json({
            status: 401,
            result: 'Forbidden'
        });
    }
    res.end();
});

app.route('/user/:userId')
    .get((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                res.status(200).json({
                    status: 200,
                    result: user
                });
            } else {
                res.status(401).json({
                    status: 401,
                    result: 'Forbidden'
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    })
    .put((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId
            let user = database.filter((item) => item.id == userId);
            let id = parseInt(userId);
            if(user.length > 0) {
                let updatedUser = req.body;
                updatedUser = {
                    id,
                    ...updatedUser
                }
                database[userId] = updatedUser;
                res.status(201).json({
                    status: 201,
                    result: database
                });
            } else {
                res.status(401).json({
                    status: 401,
                    result: 'Forbidden'
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    })
    .delete((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                database.splice(userId, 1);
                res.status(201).json({
                    status: 201,
                    result: database
                });
            } else {
                res.status(401).json({
                    status: 401,
                    result: 'Forbidden'
                });
            }
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            });
        }
        res.end();
    });

// Return a 404 status if the link doesn't exist
app.all('*', (req, res) => {
    res.status(404).json({
        status: 404,
        result: 'End-point not found'
    });
    res.end();
});

// Show which port is set available for the app
app.listen(port, () => {
    console.log('App listening on localhost:' + port)
})