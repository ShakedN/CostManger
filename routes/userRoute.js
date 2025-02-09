// Import required modules

const express = require('express'); // Express framework for routing
const User = require('../models/users'); // User model to interact with the users collection in MongoDB
const Cost = require('../models/costs'); // Cost model to interact with costs collection in MongoDB
const router = express.Router(); // Create a new instance of the Express router

// GET route to get details of a specific user by their ID
router.get('/:id', async (req, res) => {
            try {
                const { id } = req.params;

                const user = await User.findOne({ id });
                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                // חישוב סך כל ההוצאות של המשתמש
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
                res.status(500).json({ error: "An error occurred" });
            }
        });




// Export the router so it can be used in app.js
module.exports = router;
