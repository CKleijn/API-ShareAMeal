// Default settings
const assert = require('assert');
const dbconnection = require('../../database/dbconnection');

// Create an MealController
let mealController = {
    validateMeal: (req, res, next) => {
        let meal = req.body;
        let { name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price } = meal;
        try {
            assert(typeof name === 'string', 'name must be a string!');
            assert(typeof description === 'string', 'description must be a string!');
            assert(typeof isActive === 'boolean' || typeof isActive === 'number', 'IsActive must be a boolean or number between 0 and 1!');
            assert(typeof isVega === 'boolean' || typeof isVega === 'number', 'IsVega must be a boolean or number between 0 and 1!');
            assert(typeof isVegan === 'boolean' || typeof isVegan === 'number', 'IsVegan must be a boolean or number between 0 and 1!');
            assert(typeof isToTakeHome === 'boolean' || typeof isToTakeHome === 'number', 'IsToTakeHome must be a boolean or number between 0 and 1!');
            assert(typeof dateTime === 'string', 'dateTime must be a string!');
            assert(typeof imageUrl === 'string', 'imageUrl must be a string!');
            assert(typeof allergenes === 'string', 'allergenes must be a string!');
            assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants must be a number!');
            assert(typeof price === 'number', 'price must be a number!');
            next();
        } catch (err) {
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    getAllMeals: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
           
            connection.query('SELECT * FROM meal', function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(200).json({
                        status: 200,
                        result: results
                    });
                    res.end();
                } else {
                    return next({
                        status: 403,
                        message: 'Forbidden'
                    });
                }
            });
        });
    },
    addMeal: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            let meal = req.body;
                meal = {
                    ...meal
                }
                
            connection.query("INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, allergenes, maxAmountOfParticipants, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            [meal.name, meal.description, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.imageUrl, meal.allergenes, meal.maxAmountOfParticipants, meal.price], 
                            (err, results, fields) => {
                connection.release();

                if (err) throw err;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    res.status(201).json({
                        status: 201,
                        message: 'Meal has been created!',
                        result: meal
                    });
                    res.end();
                } else {
                    return next({
                        status: 403,
                        message: 'Forbidden'
                    });
                }
            });
        });
    },
    getMealById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
           
            const mealId = req.params.mealId;

            if (isNaN(mealId)) {
                return next();
            }

            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                if(results.length > 0) {
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        res.status(200).json({
                            status: 200,
                            result: results
                        });
                        res.end();
                    } else {
                        return next({
                            status: 403,
                            message: 'Forbidden'
                        });
                    }
                } else {
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    updateMealById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            const mealId = req.params.mealId;

            if (isNaN(mealId)) {
                return next();
            }

            let updatedMeal = req.body;
                updatedMeal = {
                    ...updatedMeal
                }

            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                if (err) throw err;

                if(results.length > 0) {
                    connection.query('UPDATE meal SET name = ?, description = ?, isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, imageUrl = ?, allergenes = ?, maxAmountOfParticipants = ?, price = ? WHERE id = ?',
                    [updatedMeal.name, updatedMeal.description, updatedMeal.isActive, updatedMeal.isVega, updatedMeal.isVegan, updatedMeal.isToTakeHome, updatedMeal.dateTime, updatedMeal.imageUrl, updatedMeal.allergenes, updatedMeal.maxAmountOfParticipants, updatedMeal.price, mealId],
                            function (err, results, fields) {
                        connection.release();

                        if (err) throw err;

                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            res.status(201).json({
                                status: 201,
                                message: 'Meal has been updated!',
                                result: updatedMeal
                            });
                            res.end();
                        } else {
                            return next({
                                status: 403,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    deleteMealById: (req, res, next) => {
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;

            const mealId = req.params.mealId;

            if (isNaN(mealId)) {
                return next();
            }

            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                if (err) throw err;

                if(results.length > 0) {
                    connection.query('DELETE FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            res.status(201).json({
                                status: 201,
                                message: 'Meal has been removed!'
                            });
                            res.end();
                        } else {
                            return next({
                                status: 403,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    }
};

module.exports = mealController;