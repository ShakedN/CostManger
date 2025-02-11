/**
 * @file Defines a custom error class for cost validation.
 */

const { IdValidationError, validateId } = require('../errors/idValidationError'); // Correct import

/**
 * Represents a cost validation error.
 * @extends Error
 */
class CostValidationError extends Error {
    /**
     * Constructs a new CostValidationError.
     * @param {string} message - The error message.
     * @param {string} type - The type of the error.
     */
    constructor(message, type) {
        super(message);
        this.name = "CostValidationError";
        this.type = type;
    }

    /**
     * Creates a new CostValidationError for missing parameters.
     * @returns {CostValidationError} The error instance.
     */
    static missingParameters() {
        return new CostValidationError("Missing required fields: description, category, userid, sum", "Missing Parameters");
    }

    /**
     * Creates a new CostValidationError for an invalid category.
     * @returns {CostValidationError} The error instance.
     */
    static invalidCategory() {
        return new CostValidationError("Invalid category. Allowed values: food, health, housing, sport, education", "Invalid Category");
    }

    /**
     * Creates a new CostValidationError for an invalid sum.
     * @returns {CostValidationError} The error instance.
     */
    static invalidSum() {
        return new CostValidationError("Sum must be a positive number", "Invalid Sum");
    }

    /**
     * Creates a new CostValidationError for an invalid date format.
     * @returns {CostValidationError} The error instance.
     */
    static invalidDateFormat() {
        return new CostValidationError("Invalid date format. Use YYYY-MM-DD", "Invalid Date Format");
    }

    /**
     * Creates a new CostValidationError for an invalid date value.
     * @returns {CostValidationError} The error instance.
     */
    static invalidDateValue() {
        return new CostValidationError("Invalid date. Ensure it is a real calendar date in YYYY-MM-DD format.", "Invalid Date");
    }

    /**
     * Creates a new CostValidationError for an outdated date.
     * @returns {CostValidationError} The error instance.
     */
    static outdatedDate() {
        return new CostValidationError("Date is too old. Cannot add costs older than 10 days from last month.", "Outdated Date");
    }

    /**
     * Validates the cost data in the request.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static validateCost(req, res, next) {
        const { description, category, userid, sum, date } = req.body;
        const validCategories = ['food', 'health', 'housing', 'sport', 'education'];

        validateId(req, res, (err) => {
            if (err) {
                return next(err);
            }

            // Check if all required fields exist
            if (!description || !category || !userid || !sum) {
                return next(CostValidationError.missingParameters());
            }

            // Validate category
            if (!validCategories.includes(category)) {
                return next(CostValidationError.invalidCategory());
            }

            // Validate sum
            if (typeof sum !== "number" || sum < 0) {
                return next(CostValidationError.invalidSum());
            }

            const currentDate = new Date();
            let costDate = date ? new Date(date) : currentDate;

            // Validate if the date is a real calendar date
            if (isNaN(costDate.getTime())) {
                return next(CostValidationError.invalidDateValue());
            }

            // Validate date format (YYYY-MM-DD)
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (date && !dateRegex.test(date)) {
                return next(CostValidationError.invalidDateFormat());
            }

            // Ensure the provided date exists in the calendar
            if (date) {
                const [year, month, day] = date.split("-").map(Number);
                const parsedDate = new Date(year, month - 1, day);
                if (parsedDate.getFullYear() !== year || parsedDate.getMonth() + 1 !== month || parsedDate.getDate() !== day) {
                    return next(CostValidationError.invalidDateValue());
                }
            }

            // Calculate the last allowed date (10 days after the last day of the previous month)
            const lastMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
            const lastAllowedDate = new Date(lastMonthLastDay);
            lastAllowedDate.setDate(lastMonthLastDay.getDate() + 10);

            // Check if the date is within the allowed range
            if (costDate <= lastMonthLastDay || costDate > lastAllowedDate) {
                return next(CostValidationError.outdatedDate());
            }

            next();
        });
    }
}

module.exports = { CostValidationError, validateCost: CostValidationError.validateCost };
