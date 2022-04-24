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
        id: 1,
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
        id: 2,
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

let id = 2;

// All /user routes
app.route('/api/user')
    // Get all users
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
    // Create an user
    .post((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            let user = req.body;
            let isUsed = false;
            database.forEach(item => {
                if(item.emailAdress == user.emailAdress) {
                    isUsed = true;
                }
            });
            if(!isUsed) {
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
            } else {
                res.status(409).json({
                    status: 409,
                    result: user.emailAdress + ' is not unique'
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

// Get user profile
app.get('/api/user/profile', (req, res) => {
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

// All /user/:userId routes
app.route('/api/user/:userId')
    // Get specific user on userId
    .get((req, res, next) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                next();
            }
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                res.status(200).json({
                    status: 200,
                    result: user
                });
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
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
    // Update specific user on userId
    .put((req, res, next) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                next();
            }
            let user = database.filter((item) => item.id == userId);
            let id = parseInt(userId);
            if(user.length > 0) {
                let updatedUser = req.body;
                let isUsed = false;
                database.forEach(item => {
                    if(item.emailAdress == updatedUser.emailAdress) {
                        isUsed = true;
                    }
                });
                if(!isUsed) {
                    updatedUser = {
                        id,
                        ...updatedUser
                    }
                    database[database.findIndex((item) => item.id == userId)] = updatedUser;
                    res.status(201).json({
                        status: 201,
                        result: database
                    });
                } else {
                    res.status(409).json({
                        status: 409,
                        result: updatedUser.emailAdress + ' is not unique'
                    });
                }
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
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
    // Delete specific user on userId
    .delete((req, res, next) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            const userId = req.params.userId;
            if (isNaN(userId)) {
                next();
            }
            let user = database.filter((item) => item.id == userId);
            if(user.length > 0) {
                database = database.filter((item) => item.id != userId);
                res.status(201).json({
                    status: 201,
                    result: database
                });
            } else {
                res.status(404).json({
                    status: 404,
                    result: 'None of the users got an id of ' + userId
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