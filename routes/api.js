const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Cost = require('../models/costs');

// Add a new cost
router.post('/add', async function (req, res) {
    console.log('Received request to /add');
    const { description, category, user_id, sum, date } = req.body;
    const finalDate = date || new Date();

    // Check required fields
    if (!description || !category || !user_id || !sum) {
        return res.status(400).json({
            message: 'Error: Missing required fields',
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ id: user_id });
        if (!user) {
            return res.status(404).json({
                message: 'Error: User not found',
            });
        }

        // Create new cost document
        const newCost = await Cost.create({
            description,
            category,
            user_id,
            sum,
            date: finalDate,
        });

        // Update user's computed_costs
        const currentMonth = new Date(finalDate).toISOString().slice(0, 7); // Format month: YYYY-MM
        if (!user.computed_costs.has(currentMonth)) {
            user.computed_costs.set(currentMonth, new Map());
        }

        const categoryCosts = user.computed_costs.get(currentMonth);
        const currentSum = categoryCosts.get(category) || 0;
        categoryCosts.set(category, currentSum + sum);

        // Save user after update
        user.markModified('computed_costs'); // Mark the field as modified
        await user.save();

        // Respond to client
        res.status(201).json({
            message: 'Cost item added successfully',
            cost: newCost,
        });
    } catch (error) {
        // Handle errors
        console.error('Error adding cost item:', error);
        res.status(500).json({
            message: 'Error: Could not add cost item',
            error: error.message,
            details: error.errors || error,
        });
    }
});

// Get monthly report
router.get('/report', async function(req, res, next) {
    const { id, year, month } = req.query;

    // Check params
    if (!id || !year || !month) {
        return res.status(400).json({ error: 'Missing required query parameters: id, year, or month.' });
    }

    // Validation
    if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
        return res.status(400).json({ error: 'Invalid year or month.' });
    }

    try {
        // Search in database
        const costs = await Cost.find({
            user_id: id,
            date: {
                $gte: new Date(year, month - 1, 1), // Start of the month
                $lt: new Date(year, month, 1)      // Start of the next month
            }
        });

        // Check if no results found
        if (costs.length === 0) {
            return res.status(404).json({ error: 'No costs found for the specified user, year, and month.' });
        }

        // Group costs by category
        const groupedCosts = costs.reduce((acc, cost) => {
            if (!acc[cost.category]) {
                acc[cost.category] = [];
            }
            acc[cost.category].push(cost);
            return acc;
        }, {});

        // Return the grouped costs
        res.status(200).json(groupedCosts);
    } catch (error) {
        // Handle errors
        next(error);
    }
});

// Get user details and total costs for the current month
router.get('/users/:id', async function(req, res, next) {
    const userId = req.params.id.trim();
    try {
        // Find user by user_id
        const user = await User.findOne({ id: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Calculate total costs for the current month
        let total = 0;
        const currentMonth = new Date().toISOString().slice(0, 7); // Format month: YYYY-MM

        // If there are costs for the current month, calculate the total
        if (user.computed_costs.has(currentMonth)) {
            const categoryCosts = user.computed_costs.get(currentMonth);
            total = Array.from(categoryCosts.values()).reduce((sum, categorySum) => sum + categorySum, 0);
        }

        // Response with all details
        res.status(200).json({
            first_name: user.first_name,
            last_name: user.last_name,
            id: user.id,
            total: total
        });
    } catch (error) {
        next(error);
    }
});

/* GET users listing. */
router.get('/about', function(req, res, next) {
    res.json([{ first_name: 'Shaked', last_name: 'Bardea' }, { first_name: 'Shaked', last_name: 'Nuttman' }]);
});

module.exports = router;