/**
 * @module userRoute
 * This module defines routes related to user operations in the application.
 * It includes handling requests to fetch user details and their total costs.
 */

const express = require('express'); // Express framework for routing
const User = require('../models/users'); // User model to interact with the users collection in MongoDB
const Cost = require('../models/costs'); // Cost model to interact with costs collection in MongoDB
const { IdValidationError, validateId } = require('../errors/IdValidationError'); // Correct import
const router = express.Router(); // Create a new instance of the Express router

/**
 * Route to get details of a specific user by their ID.
 * This route is responsible for retrieving user details, including their first name,
 * last name, ID, and the total costs associated with the user.
 *
 * @route GET /api/users/:id
 * @param {string} id - The unique identifier of the user (numeric, max 9 characters).
 * @param {Function} validateId - Middleware function to validate the user ID.
 * @returns {Object} 200 - A JSON object containing the user's details and total cost.
 * @returns {Object} 404 - If the user is not found, an error message is returned.
 * @returns {Object} 400 - If there is an error with the ID validation.
 * @throws {IdValidationError} - If the provided ID is invalid.
 */
router.get('/:id', validateId, async (req, res, next) => {
    try {
        const { id } = req.params;

        // Fetch user details from the database
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate the total costs associated with the user
        const totalCosts = await Cost.aggregate([
            { $match: { userid: id } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        // If no costs are found, total is 0
        const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

        // Return the user's details along with the total cost
        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });

    } catch (err) {
        next(err);  // Pass any errors to the error handler
    }
});

// Export the router so it can be used in app.js
module.exports = router;
