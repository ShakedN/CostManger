const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the cost schema
const costSchema = new Schema({
    description: {type: String, required: true},
    category: {type: String, required: true, enum: ['food', 'health', 'housing', 'sport', 'education']}, // Only one of these values is valid
    userid: {type: String, required: true},
    sum: {type: Number, required: true},
    date: {type: Date, required: true, default: Date.now}, // Default value is the current date if not provided
});

// Create a model based on the cost schema
const Cost = mongoose.model('costs', costSchema);

// Export the Cost model so it can be used elsewhere
module.exports = Cost;
