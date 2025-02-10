/**
 * @module aboutRoute
 * This module defines the route to get information about the team members.
 */

const express = require('express'); // Express framework for routing
const router = express.Router(); // Create a new router instance for handling routes

/**
 * GET route to return team members.
 *
 * This route processes a GET request to retrieve the list of team members.
 *
 * @route GET /about
 * @returns {Object} 200 - A JSON array containing the team members.
 */
router.get('/about', (req, res) => {
    const teamMembers = [
        { first_name: 'Shaked', last_name: 'Bardea' },
        { first_name: 'Shaked', last_name: 'Nuttman' }
    ];
    res.status(200).json(teamMembers);
});

module.exports = router;