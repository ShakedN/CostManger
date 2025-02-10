// Import required modules
const express = require('express'); // Express framework for routing
const mongoose = require('mongoose'); // Mongoose to interact with MongoDB
const Cost = require('../models/costs'); // Cost model to interact with costs collection in MongoDB
const User = require('../models/users'); // User model to interact with users collection
const router = express.Router(); // Create a new router instance for handling routes

// POST route to add a new cost item
router.post('/add', async (req, res) => {
    try {
        const { description, category, userid, sum, date } = req.body;
        const currentDate = new Date();
        const costDate = date ? new Date(date) : currentDate;

        // בדיקת תאריך - אם התאריך בחודש שעבר ועברו יותר מ-10 ימים, נחסום
        const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const tenDaysAgo = new Date(currentDate);
        tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

        if (costDate < lastMonth && costDate < tenDaysAgo) {
            throw CostValidationError.invalidDate();
        }

        // יצירת עלות חדשה ושמירה
        const newCost = new Cost({ description, category, userid, sum, date: costDate });
        await newCost.save();

        res.status(201).json(newCost);
    } catch (err) {
        if (err instanceof CostValidationError) {
            return res.status(400).json({ error: err.message, type: err.type });
        }
        res.status(500).json({ error: 'An error occurred' });
    }
});


router.get("/report", async (req, res) => {
    try {
        const { id, year, month } = req.query;

        if (!id || !year || !month) {
            throw ReportValidationError.missingParameters();
        }

        const user = await User.findOne({ id });
        if (!user) {
            throw ReportValidationError.userNotFound();
        }

        const requestMonth = `${year}-${String(month).padStart(2, "0")}`;

        // חישוב כמה ימים עברו מסוף החודש
        let now = new Date();
        let daysSinceEndOfMonth = (now - new Date(year, month, 0)) / (1000 * 60 * 60 * 24);

        // אם עברו 10 ימים והדוח כבר קיים ב-computed_costs → נחזיר אותו
        if (daysSinceEndOfMonth > 10 && user.computed_costs && user.computed_costs.has(requestMonth)) {
            return res.status(200).json({
                userid: id,
                year,
                month,
                costs: user.computed_costs.get(requestMonth)
            });
        }

        // חיפוש הוצאות רלוונטיות מהמסד נתונים
        const costs = await Cost.find({
            userid: id,
            date: {
                $gte: new Date(year, month - 1, 1),
                $lt: new Date(year, month, 1)
            }
        });

        // בניית הפורמט החדש עם מערכים לכל קטגוריה
        const categories = ["food", "health", "housing", "sport", "education"];
        const report = {};
        categories.forEach(category => {
            report[category] = [];
        });

        costs.forEach(cost => {
            if (report.hasOwnProperty(cost.category)) {
                report[cost.category].push({
                    sum: cost.sum,
                    description: cost.description,
                    day: new Date(cost.date).getDate()
                });
            }
        });

        // **אם עברו 10 ימים מאז תום החודש → שומרים את הדוח**
        if (daysSinceEndOfMonth > 10) {
            await User.updateOne({ id }, { $set: { [`computed_costs.${requestMonth}`]: report } });
        }

        res.status(200).json({ userid: id, year, month, costs: report });

    } catch (err) {
        if (err instanceof ReportValidationError) {
            return res.status(400).json({ error: err.message, type: err.type });
        }
        res.status(500).json({ error: "An error occurred" });
    }
});

module.exports = router;





// Export the router to use in the main app file
module.exports = router;
