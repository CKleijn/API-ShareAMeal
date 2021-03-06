// Default settings
const http = require('http');
const express = require('express');
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const authRouter = require('./src/routes/authentication.routes');
const userRouter = require('./src/routes/user.routes');
const mealRouter = require('./src/routes/meal.routes');

// Use body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// Use authentication.routes
app.use(authRouter);
// Use user.routes
app.use(userRouter);
// Use meal.routes
app.use(mealRouter);

// Return a 404 status if the link doesn't exist
app.all('*', (req, res) => {
    res.status(404).json({
        status: 404,
        result: 'End-point not found'
    });
    res.end();
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status).json(err);
});

// Show which port is set available for the app
app.listen(port, () => {
    console.log('App listening on localhost:' + port)
})

module.exports = app;