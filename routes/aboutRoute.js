// Import required modules
const express = require('express');
const router = express.Router();

// GET route to return team members
router.get('/about', (req, res) => {
    const teamMembers = [
        { first_name: 'Shaked', last_name: 'Bardea' },
        { first_name: 'Shaked', last_name: 'Nuttman' }
    ];
    res.status(200).json(teamMembers);
});

module.exports = router;
