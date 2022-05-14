// Default settings
const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const authController = require('../controllers/authentication.controller');

// All /meal routes
router.route('/api/meal')
    // Get all meals
    .get(mealController.getAllMeals)
    // Create a meal + validation
    .post(authController.validateToken, mealController.validateMeal, mealController.addMeal);

// All /meal/:mealId routes
router.route('/api/meal/:mealId')
    // Get meal by mealId
    .get(mealController.getMealById)
    // Update meal by mealId + validation
    .put(authController.validateToken, mealController.validateMeal, mealController.updateMealById)
    // Delete meal by mealId
    .delete(authController.validateToken, mealController.deleteMealById);

// Export the mealRouter
module.exports = router;