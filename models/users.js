/**
     * @module users
     * This module defines the Mongoose schema and model for users.
     */

    const mongoose = require('mongoose');
    const schema = mongoose.Schema;

    /**
     * User schema definition.
     *
     * @typedef {Object} User
     * @property {String} id - Unique identifier for the user.
     * @property {String} first_name - First name of the user.
     * @property {String} last_name - Last name of the user.
     * @property {Date} birthday - Birthday of the user.
     * @property {String} marital_status - Marital status of the user.
     * @property {Map<String, Object>} computed_costs - Computed costs associated with the user.
     */
    const userSchema = new schema({
        id: {type: String, required: true, unique: true},   // Ensures each user has a unique 'id'
        first_name: {type: String, required: true},
        last_name: {type: String, required: true},
        birthday: {type: Date, required: true},
        marital_status: {type: String, required: true},
        computed_costs: {
            type: Map,  // 'computed_costs' is a Map type (key-value pairs)
            of: Object,  // The values in the map are Numbers
            default: {}, // If no value is provided, it defaults to an empty object
        }
    });

    /**
     * User model based on the user schema.
     *
     * @type {Model<User>}
     */
    const User = mongoose.model('users', userSchema);

    // Export the User model so it can be used elsewhere
    module.exports = User;