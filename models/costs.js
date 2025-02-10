/**
 * @module costs
 * This module defines the Mongoose schema and model for costs.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Cost schema definition.
 *
 * @typedef {Object} Cost
 * @property {String} description - Description of the cost.
 * @property {String} category - Category of the cost, must be one of ['food', 'health', 'housing', 'sport', 'education'].
 * @property {String} userid - User ID associated with the cost.
 * @property {Number} sum - Sum of the cost.
 * @property {Date} date - Date of the cost, defaults to the current date if not provided.
 */
const costSchema = new Schema({
    description: {type: String, required: true},
    category: {type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education']}, // Only one of these values is valid
    userid: {type: String, required: true},
    sum: {type: Number, required: true},
    date: {type: Date, required: true, default: Date.now}, // Default value is the current date if not provided
});

costSchema.set('toJSON', {
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

/**
 * Cost model based on the cost schema.
 *
 * @type {Model<Cost>}
 */
const Cost = mongoose.model('costs', costSchema);

// Export the Cost model so it can be used elsewhere
module.exports = Cost;
