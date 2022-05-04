// Default settings
const express = require('express');
const router = express.Router();
const mealController = require('../controllers/meal.controller');

// All /meal routes
router.route('/api/meal')
    // Get all meals
    .get(mealController.getAllMeals)
    // Create a meal
    .post(mealController.validateMeal, mealController.addMeal);

// All /meal/:mealId routes
router.route('/api/meal/:mealId')
    // Get meal by mealId
    .get(mealController.getMealById)
    // Update meal by mealId
    .put(mealController.validateMeal, mealController.updateMealById)
    // Delete meal by mealId
    .delete(mealController.deleteMealById);

module.exports = router;