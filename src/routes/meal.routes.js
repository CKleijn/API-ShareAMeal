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
    .post(authController.validateToken, mealController.validateCreateMeal, mealController.addMeal);

// All /meal/:mealId routes
router.route('/api/meal/:mealId')
    // Get meal by mealId
    .get(mealController.getMealById)
    // Update meal by mealId + validation
    .put(authController.validateToken, mealController.validateUpdateMeal, mealController.updateMealById)
    // Delete meal by mealId
    .delete(authController.validateToken, mealController.deleteMealById);

// Participate in a meal
router.get('/api/meal/:mealId/participate', authController.validateToken, mealController.participateMeal);

// Export the mealRouter
module.exports = router;