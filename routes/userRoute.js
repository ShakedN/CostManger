/**
 * @file User details retrieval route.
 * @description This module defines an Express route to fetch user details
 * along with the total costs associated with the user.
 */

const express = require('express'); // Express framework for routing
const User = require('../models/users'); // User model to interact with the users collection in MongoDB
const Cost = require('../models/costs'); // Cost model to interact with the costs collection in MongoDB
const { IdValidationError, validateId } = require('../errors/idValidationError'); // ID validation utilities
const router = express.Router(); // Create a new instance of the Express router

/**
 * Retrieves details of a specific user by their ID, including their total costs.
 *
 * @route GET /users/:id
 * @param {Object} req - Express request object containing the user ID as a route parameter.
 * @param {Object} res - Express response object used to return user details and total costs.
 * @param {Function} next - Express next function for error handling.
 * @returns {JSON} JSON object with user details and total costs or an error message.
 */
router.get('/:id', validateId, async (req, res, next) => {
    try {
        const { id } = req.params; // Extract user ID from request parameters

        // Find the user by ID in the database
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: "User not found" }); // Return 404 if user does not exist
        }

        /**
         * Aggregate total costs for the user.
         *
         * @constant
         * @type {Array}
         */
        const totalCosts = await Cost.aggregate([
            { $match: { userid: id } }, // Match costs by user ID
            { $group: { _id: null, total: { $sum: "$sum" } } } // Sum all user costs
        ]);

        const total = totalCosts.length > 0 ? totalCosts[0].total : 0; // Retrieve total cost or default to 0

        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total
        });

    } catch (err) {
        next(err); // Pass any errors to the Express error handler
    }
});

/**
 * Exports the router to be used in the main application.
 *
 * @module router
 */
module.exports = router;
