// Default settings
const assert = require('assert');
const { json } = require('express/lib/response');
const dbconnection = require('../../database/dbconnection');

// Create an MealController
const mealController = {
    // Create validation
    validateMeal: (req, res, next) => {
        // Get request and assign it as an user
        const meal = req.body;
        const { name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, maxAmountOfParticipants, price, allergenes } = meal;
        try {
            // Put assert on each key to create the validation
            assert(typeof name === 'string', 'name must be a string!');
            assert(typeof description === 'string', 'description must be a string!');
            assert(typeof isActive === 'boolean' || typeof isActive === 'number', 'IsActive must be a boolean or number between 0 and 1!');
            assert(typeof isVega === 'boolean' || typeof isVega === 'number', 'IsVega must be a boolean or number between 0 and 1!');
            assert(typeof isVegan === 'boolean' || typeof isVegan === 'number', 'IsVegan must be a boolean or number between 0 and 1!');
            assert(typeof isToTakeHome === 'boolean' || typeof isToTakeHome === 'number', 'IsToTakeHome must be a boolean or number between 0 and 1!');
            assert(typeof dateTime === 'string', 'dateTime must be a string!');
            assert(typeof imageUrl === 'string', 'imageUrl must be a string!');
            assert(typeof maxAmountOfParticipants === 'number', 'maxAmountOfParticipants must be a number!');
            assert(typeof price === 'number', 'price must be a number!');
            // assert(typeof allergenes === 'array', 'allergenes must be an array!');
            next();
        } catch (err) {
            // Return status + message to error handler
            return next({
                status: 400,
                message: err.message
            });
        }
    },
    // GET all meals with query
    getAllMeals: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get meals without any filters
            connection.query('SELECT * FROM meal', function (err, results, fields) {
                connection.release();
            
                if (err) throw err;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    // Return JSON with response
                    res.status(200).json({
                        status: 200,
                        result: formatMeal(results)
                    });
                    res.end();
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 403,
                        message: 'Forbidden'
                    });
                }
            });
        });
    },
    addMeal: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get request and assign it as a meal
            const meal = {
                    ...req.body
                }
            // Create the meal    
            connection.query("INSERT INTO meal (name, description, isActive, isVega, isVegan, isToTakeHome, dateTime, imageUrl, maxAmountOfParticipants, price, allergenes, cookId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                            [meal.name, meal.description, meal.isActive, meal.isVega, meal.isVegan, meal.isToTakeHome, meal.dateTime, meal.imageUrl, meal.maxAmountOfParticipants, meal.price, meal.allergenes.join(), req.userId], 
                            (err, results, fields) => {
                connection.release();

                if (err) throw err;

                if(res.statusCode >= 200 && res.statusCode <= 299) {
                    const mealId = results.insertId;
                    // Get meal with given mealId
                    connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) { 
                        connection.release();

                        if (err) throw err;
                        // Return JSON with response
                        res.status(201).json({
                            status: 201,
                            message: 'Meal has been created!',
                            result: formatMeal(results)
                        });
                        res.end();
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 403,
                        message: 'Forbidden'
                    });
                }
            });
        });
    },
    getMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get the meal with the given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                connection.release();
            
                if (err) throw err;
                // If a meal is found get into the if statement
                if(results.length > 0) {
                    if(res.statusCode >= 200 && res.statusCode <= 299) {
                        // Return JSON with response
                        res.status(200).json({
                            status: 200,
                            result: formatMeal(results)
                        });
                        res.end();
                    } else {
                        // Return status + message to error handler
                        return next({
                            status: 403,
                            message: 'Forbidden'
                        });
                    }
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    updateMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get cookId from token
            const cookId = req.userId;        
            // Get the meal with the given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                if (err) throw err;
                // If a meal is found get into the if statement
                if(results.length > 0) {
                    // Check if id's aren't equal
                    if(cookId !== results[0].cookId) {
                        // Return status + message to error handler
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                    // Get request and assign it as a meal
                    const updatedMeal = {
                            ...results[0],
                            ...req.body
                        }
                    // Update the meal
                    connection.query('UPDATE meal SET name = ?, description = ?, isActive = ?, isVega = ?, isVegan = ?, isToTakeHome = ?, dateTime = ?, imageUrl = ?, allergenes = ?, maxAmountOfParticipants = ?, price = ? WHERE id = ?',
                    [updatedMeal.name, updatedMeal.description, updatedMeal.isActive, updatedMeal.isVega, updatedMeal.isVegan, updatedMeal.isToTakeHome, updatedMeal.dateTime, updatedMeal.imageUrl, updatedMeal.allergenes, updatedMeal.maxAmountOfParticipants, updatedMeal.price, mealId],
                            function (err, results, fields) {
                        connection.release();

                        if (err) throw err;

                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            // Return JSON with response
                            res.status(200).json({
                                status: 200,
                                message: 'Meal has been updated!',
                                result: formatMeal(updatedMeal)
                            });
                            res.end();
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 403,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    },
    // DELETE meal with given mealId
    deleteMealById: (req, res, next) => {
        // Open connection and throw an error if it exist
        dbconnection.getConnection(function(err, connection) {
            if (err) throw err;
            // Get mealId paramater from URL
            const mealId = req.params.mealId;
            // Check if mealId isnt a number
            if (isNaN(mealId)) {
                return next();
            }
            // Get cookId from token
            const cookId = req.userId;
            // Get the meal with the given mealId
            connection.query('SELECT * FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                if (err) throw err;
                // If a meal is found get into the if statement
                if(results.length > 0) {
                    // Check if id's aren't equal
                    if(cookId !== results[0].cookId) {
                        // Return status + message to error handler
                        return next({
                            status: 401,
                            message: 'Forbidden'
                        });
                    }
                    // Delete the meal
                    connection.query('DELETE FROM meal WHERE id = ?', mealId, function (err, results, fields) {
                        connection.release();
                    
                        if (err) throw err;
        
                        if(res.statusCode >= 200 && res.statusCode <= 299) {
                            // Return JSON with response
                            res.status(200).json({
                                status: 200,
                                message: 'Meal has been removed!'
                            });
                            res.end();
                        } else {
                            // Return status + message to error handler
                            return next({
                                status: 403,
                                message: 'Forbidden'
                            });
                        }
                    });
                } else {
                    // Return status + message to error handler
                    return next({
                        status: 401,
                        message: 'Meal does not exist with the id of ' + mealId
                    });
                }
            });
        });
    }
};

const formatMeal = (results) => {
    // Take each result
    results.forEach(result => {
        // Get the values that we want to modify
        let boolObj = {
            isActive: result.isActive,
            isVega: result.isVega,
            isVegan: result.isVegan,
            isToTakeHome: result.isToTakeHome
        }
        // Get all the keys from the object
        let keys = Object.keys(boolObj);
        // Check for each key if value is 1 or 0 and modify it to true or false
        keys.forEach(key => {
            if(boolObj[key] === 1) {
                boolObj[key] = true;
            } else {
                boolObj[key] = false;
            }
        });
        // Assign the modified values to the results object
        result.isActive = boolObj.isActive;
        result.isVega = boolObj.isVega;
        result.isVegan = boolObj.isVegan;
        result.isToTakeHome = boolObj.isToTakeHome;
        // From string to array
        result.allergenes = result.allergenes.split(",");
        // Check if allergenes is empty
        if (result.allergenes.length === 0) {
            result.allergenes = [];
        }
    });
    // If length is 1 than return 1 result
    if(results.length === 1) {
        return results[0];
    }
    // Return the modified results
    return results;
}

// Export the mealController
module.exports = mealController;