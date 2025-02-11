/**
 * @module costs
 * @description This module defines the Mongoose schema and model for costs.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Represents a cost entry in the database.
 *
 * @typedef {Object} Cost
 * @property {string} description - A brief description of the cost.
 * @property {string} category - The category of the cost. Must be one of ['food', 'health', 'housing', 'sport', 'education'].
 * @property {string} userid - The ID of the user associated with this cost.
 * @property {number} sum - The total amount of the cost.
 * @property {Date} date - The date of the cost. Defaults to the current date if not provided.
 */
const costSchema = new Schema({
    description: { type: String, required: true },
    category: { type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education'] }, // Restricted to predefined values
    userid: { type: String, required: true },
    sum: { type: Number, required: true },
    date: { type: Date, required: true, default: Date.now }, // Defaults to the current date
});

// Configure JSON output to exclude the MongoDB _id field
costSchema.set('toJSON', {
    versionKey: false,
    transform: (_, ret) => {
        delete ret._id;
    }
});

/**
 * Mongoose model for managing cost records.
 *
 * @constant
 * @type {mongoose.Model<Cost>}
 */
const Cost = mongoose.model('costs', costSchema);

/**
 * Exports the Cost model for use in other parts of the application.
 *
 * @module Cost
 */
module.exports = Cost;
