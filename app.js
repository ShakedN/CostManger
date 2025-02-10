/**
 * @module app
 * This module sets up the Express.js server, handles route definitions for various API endpoints,
 * connects to MongoDB using Mongoose, and sets up global error handling.
 */

const express = require('express'); // Express framework for routing and handling HTTP requests
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const costRoute = require('./routes/costRoute'); // Import the routes related to costs
const userRoute = require('./routes/userRoute'); // Import the routes related to users
const aboutRoute = require('./routes/aboutRoute'); // Import the route for "about"
const app = express(); // Create an instance of Express
const IdValidationError = require('./errors/IdValidationError').IdValidationError; // Import custom error for ID validation
const CostValidationError = require('./errors/CostValidationError').CostValidationError; // Import custom error for cost validation
const ReportValidationError = require('./errors/ReportValidationError').ReportValidationError; // Import custom error for report validation
const dotenv = require('dotenv'); // dotenv to load environment variables from .env file
dotenv.config(); // Load environment variables

/**
 * Middleware to parse incoming requests with JSON payloads.
 * The middleware is added globally, enabling the application to handle JSON data in request bodies.
 */
app.use(express.json());

/**
 * Connects to MongoDB using the connection URI stored in environment variables.
 * This establishes a connection to the MongoDB database to perform CRUD operations.
 *
 * @throws {Error} If unable to connect to MongoDB, an error is logged to the console.
 */
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

/**
 * Route middleware for handling cost-related routes, such as adding new costs or generating reports.
 *
 * @route /api
 * @module costRoute
 */
app.use('/api', costRoute); // Handles cost-related routes

/**
 * Route middleware for handling user-related routes, such as retrieving user details.
 *
 * @route /api/users
 * @module userRoute
 */
app.use('/api/users', userRoute); // Handles user-related routes

/**
 * Route middleware for handling about-related routes, such as project authors and information.
 *
 * @route /api
 * @module aboutRoute
 */
app.use('/api', aboutRoute); // Handles about-related routes

/**
 * Middleware for handling 404 errors.
 * This middleware is triggered if a request does not match any defined routes, and returns a 404 error with a "Not found" message.
 *
 * @route *
 * @status 404
 * @returns {Object} The error message { error: 'Not found' }
 */
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

/**
 * Global error handling middleware.
 * This middleware catches any errors thrown by the application and logs them.
 * If the error is one of the custom validation errors (IdValidationError, CostValidationError, or ReportValidationError),
 * a 400 response is sent with the error message.
 * Otherwise, a 500 response is sent for general errors.
 *
 * @param {Error} err - The error object thrown in any of the routes or middlewares
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @returns {Object} Error response (400 or 500 status)
 */
app.use((err, req, res, next) => {
    console.error(err.stack); // Log the stack trace for debugging
    if (err instanceof IdValidationError || err instanceof CostValidationError || err instanceof ReportValidationError) {
        return res.status(400).json({ error: err.message }); // Return validation error with a 400 status
    }
    res.status(500).json({ error: 'Something went wrong!' }); // Return general error with a 500 status
});

/**
 * Starts the Express.js server and listens on port 3000 for incoming requests.
 * Once the server is running, it logs the message 'Server is running on http://localhost:3000'.
 */
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});

// Export the app for use in the main app file (for testing or other configurations)
module.exports = app;
