const express = require('express'); // Express framework for routing
const User = require('../models/users'); // User model to interact with the users collection in MongoDB
const Cost = require('../models/costs'); // Cost model to interact with costs collection in MongoDB
const { IdValidationError, validateId } = require('../errors/idValidationError'); // Correct import
const router = express.Router(); // Create a new instance of the Express router

// GET route to get details of a specific user by their ID
router.get('/:id', validateId, async (req, res, next) => {
    try {
        const { id } = req.params;

        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Calculate the total costs of the user
        const totalCosts = await Cost.aggregate([
            { $match: { userid: id } },
            { $group: { _id: null, total: { $sum: "$sum" } } }
        ]);

        const total = totalCosts.length > 0 ? totalCosts[0].total : 0;

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