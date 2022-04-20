// Default settings
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// A final user object to use in the response
const user = [{ 
    id: 0,
    firstName: 'John',
    lastName: 'Doe',
    street: 'Lovensdijkstraat 61',
    city: 'Breda',
    isActive: true,
    emailAdress: 'j.doe@server.com',
    password: 'secret',
    phoneNumber: '06 12425475'  
}]

// All user routes
app.route('/user')
    .get((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: user
            })
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            })
        }
        res.end();
    })
    .post((req, res) => {
        console.log('Got a POST request at /user')
        res.send('Got a POST request at /user')
        res.end();
    })

app.get('/user/profile', (req, res) => {
    if(res.statusCode >= 200 && res.statusCode <= 299) {
        res.status(200).json({
            status: 200,
            result: user
        })
    } else {
        res.status(401).json({
            status: 401,
            result: 'Forbidden'
        })
    }
    res.end();
});

app.route('/user/:userId')
    .get((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            res.status(200).json({
                status: 200,
                result: user
            })
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            })
        }
        res.end();
    })
    .put((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            console.log('Got a PUT request at /user/:userId')
            res.send('Got a PUT request at /user/:userId')
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            })
        }
        res.end();
    })
    .delete((req, res) => {
        if(res.statusCode >= 200 && res.statusCode <= 299) {
            console.log('Got a DELETE request at /user/:userId')
            res.send('Got a DELETE request at /user/:userId')
        } else {
            res.status(401).json({
                status: 401,
                result: 'Forbidden'
            })
        }
        res.end();
    })

app.all('*', (req, res) => {
    res.status(404).json({
        status: 404,
        result: 'End-point not found'
    })
})

// Show which port is set available for the app
app.listen(port, () => {
    console.log('App listening on port ' + port);
});