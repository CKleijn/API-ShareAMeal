// Default settings
const http = require('http');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const userRouter = require('./src/routes/user.routes');

// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Use user.routes
app.use(userRouter);

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