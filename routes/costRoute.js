/**
 * @module cost_route
 * This module defines routes related to cost operations, such as adding a new cost item
 * and generating a report of costs for a specific user based on year and month.
 */

const express = require('express'); // Express framework for routing
const mongoose = require('mongoose'); // Mongoose to interact with MongoDB
const Cost = require('../models/costs'); // Cost model to interact with costs collection in MongoDB
const User = require('../models/users'); // User model to interact with users collection
const router = express.Router(); // Create a new router instance for handling routes
const { CostValidationError, validateCost } = require('../errors/costValidationError'); // Import custom error for cost validation
const { ReportValidationError, validateReportRequest } = require('../errors/reportValidationError'); // Import custom error for report validation

/**
 * Route to add a new cost item to the database.
 *
 * This route processes a POST request to add a new cost, validates the date (restricting
 * certain dates from being added), and saves the new cost in the database.
 *
 * @route POST api/add
 * @param {string} description - The description of the cost item.
 * @param {string} category - The category of the cost (e.g., food, health, etc.).
 * @param {string} userid - The user ID associated with this cost item.
 * @param {number} sum - The amount of the cost.
 * @param {string} [date] - The date the cost occurred (optional, defaults to current date).
 * @returns {Object} 201 - The created cost object.
 * @returns {Object} 400 - Error message if the date is invalid or any validation fails.
 * @returns {Object} 500 - Error message for unexpected server errors.
 * @throws {CostValidationError} - If the provided date is more than 10 days old and from last month.
 */
router.post('/add',validateCost, async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;
        const user = await User.findOne({ id: userid });
        if (!user) {
            return res.status(404).json({error: "User not found"});
        }
        const costDate = date ? new Date(date) : new Date();
        // Create and save the new cost item
        const new_cost = new Cost({ description, category, userid, sum, date: costDate });
        await new_cost.save();

        res.status(201).json(new_cost);
    } catch (err) {
        next(err);
    }
});

/**
 * Route to generate a cost report for a user for a specific month and year.
 *
 * This route retrieves the relevant cost data from the database for a specific user
 * and generates a report categorized by cost types (e.g., food, health, etc.). It checks
 * whether the report already exists and if it's more than 10 days old before creating a new one.
 *
 * @route GET /api/report
 * @param {string} id - The unique identifier of the user.
 * @param {string} year - The year of the report.
 * @param {string} month - The month of the report (1-12).
 * @returns {Object} 200 - A JSON object containing the cost report categorized by cost types.
 * @returns {Object} 400 - Error message if the required parameters are missing or any validation fails.
 * @returns {Object} 500 - Error message for unexpected server errors.
 * @throws {ReportValidationError} - If the required query parameters are missing or user is not found.
 */
router.get("/report", async (req, res) => {
    try {
        const { id, year, month } = req.query;
        const user = await User.findOne({ id });
        if (!user) {
            throw ReportValidationError.userNotFound();
        }

        const requestMonth = `${year}-${String(month).padStart(2, "0")}`;

        // Calculate the number of days since the end of the month
        let now = new Date();
        let daysSinceEndOfMonth = (now - new Date(year, month, 0)) / (1000 * 60 * 60 * 24);

        // If it's been more than 10 days and the report exists, return the saved report
        if (daysSinceEndOfMonth > 10 && user.computed_costs && user.computed_costs.has(requestMonth)) {
            return res.status(200).json({
                userid: id,
                year,
                month,
                costs: user.computed_costs.get(requestMonth)
            });
        }

        // Retrieve relevant cost data from the database
        const costs = await Cost.find({
            userid: id,
            date: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

        // Build the report object with categories
        const categories = ["food", "health", "housing", "sport", "education"];
        const report = {};
        categories.forEach(category => {
            report[category] = [];
        });

        costs.forEach(cost => {
            if (report.hasOwnProperty(cost.category)) {
                report[cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: new Date(cost.date).getDate()
                });
            }
        });

        // If it's been more than 10 days, save the report for future use
        if (daysSinceEndOfMonth > 10) {
            await User.updateOne({ id }, { $set: { [`computed_costs.${requestMonth}`]: report } });
        }

        res.status(200).json({ userid: id, year, month, costs: report });

    } catch (err) {
      next(err);
    }
});

// Export the router to use in the main app file
module.exports = router;
