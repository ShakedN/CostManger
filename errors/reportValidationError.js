/**
 * @file Defines a custom error class for report validation.
 */

const { IdValidationError, validateId } = require('../errors/idValidationError'); // Correct import

/**
 * Represents a report validation error.
 * @extends Error
 */
class ReportValidationError extends Error {
    /**
     * Constructs a new ReportValidationError.
     * @param {string} message - The error message.
     * @param {string} type - The type of the error.
     */
    constructor(message, type) {
        super(message);
        this.name = "ReportValidationError";
        this.type = type;
    }

    /**
     * Creates a new ReportValidationError for missing parameters.
     * @returns {ReportValidationError} The error instance.
     */
    static missingParameters() {
        return new ReportValidationError("Missing parameters", "Missing Parameters");
    }

    /**
     * Creates a new ReportValidationError for user not found.
     * @returns {ReportValidationError} The error instance.
     */
    static userNotFound() {
        return new ReportValidationError("User not found", "User Not Found");
    }

    /**
     * Creates a new ReportValidationError for an invalid year format.
     * @returns {ReportValidationError} The error instance.
     */
    static invalidYearFormat() {
        return new ReportValidationError("Invalid year format. Must be a four-digit number (e.g., 2024)", "Invalid Year Format");
    }

    /**
     * Creates a new ReportValidationError for an invalid month format.
     * @returns {ReportValidationError} The error instance.
     */
    static invalidMonthFormat() {
        return new ReportValidationError("Invalid month format. Must be a number between 1 and 12", "Invalid Month Format");
    }

    /**
     * Creates a new ReportValidationError for an invalid date combination.
     * @returns {ReportValidationError} The error instance.
     */
    static invalidDateCombination() {
        return new ReportValidationError("Invalid date combination. Ensure the year and month are valid", "Invalid Date Combination");
    }

    /**
     * Validates the report request.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static validateReportRequest(req, res, next) {
        const { id, year, month } = req.query;

        validateId(req, res, (err) => {
            if (err) {
                return next(err);
            }

            // Check if all required fields exist
            if (!id || !year || !month) {
                return next(ReportValidationError.missingParameters());
            }

            // Validate year format
            const numericYear = Number(year);
            const yearStr = String(year);
            if (!/^\d{4}$/.test(yearStr) || numericYear < 1900 || numericYear > 2100) {
                return next(ReportValidationError.invalidYearFormat());
            }

            // Validate month format (number between 1 and 12)
            if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
                return next(ReportValidationError.invalidMonthFormat());
            }

            // Validate year-month combination
            const parsedYear = parseInt(year, 10);
            const parsedMonth = parseInt(month, 10);
            const isValidDate = new Date(parsedYear, parsedMonth - 1, 1).getMonth() + 1 === parsedMonth;
            if (!isValidDate) {
                return next(ReportValidationError.invalidDateCombination());
            }

            next();
        });
    }
}

module.exports = { ReportValidationError, validateReportRequest: ReportValidationError.validateReportRequest };
