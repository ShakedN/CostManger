// Import required modules
const express = require('express'); // Express framework for routing and handling HTTP requests
const mongoose = require('mongoose'); // Mongoose for MongoDB object modeling
const costRoute = require('./routes/costRoute'); // Import the routes related to costs
const userRoute = require('./routes/userRoute'); // Import the routes related to users
const aboutRoute = require('./routes/aboutRoute'); // Import the route for "about"
const app = express(); // Create an instance of Express

// dotenv configuration to load environment variables from a .env file
const dotenv = require('dotenv');
dotenv.config();

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// Connect to MongoDB using mongoose and the connection URI from the environment variables
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.log('Error connecting to MongoDB:', err);
    });

// Use routes for costs, users, and about (for project information)
app.use('/api', costRoute); // Handles cost-related routes, e.g., adding costs, generating reports
app.use('/api/users', userRoute); // Handles user-related routes, e.g., getting user details
app.use('/api', aboutRoute); // Handles about-related routes, e.g., project authors information

// Handle 404 for any route that is not defined
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

// Global error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
module.exports = app;
