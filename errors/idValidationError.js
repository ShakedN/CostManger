/**
 * @file Defines a custom error class for ID validation.
 */

/**
 * Represents an ID validation error.
 * @extends Error
 */
class IdValidationError extends Error {
    /**
     * Constructs a new IdValidationError.
     * @param {string} message - The error message.
     * @param {string} type - The type of the error.
     */
    constructor(message, type) {
        super(message);
        this.name = "IdValidationError";
        this.type = type;
    }

    /**
     * Creates a new IdValidationError for incorrect input.
     * @returns {IdValidationError} The error instance.
     */
    static incorrectInput() {
        return new IdValidationError("ID must contain only numbers", "Incorrect Input");
    }

    /**
     * Creates a new IdValidationError for an ID with the wrong length.
     * @returns {IdValidationError} The error instance.
     */
    static wrongLength() {
        return new IdValidationError("ID must be no more than 9 characters long", "Wrong Length");
    }

    /**
     * Validates the ID in the request.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    static validateId(req, res, next) {
        // Retrieve the ID from various sources (params, query, body)
        const id = req.params.id || req.query.id || req.body.userid;

        // Check if ID exceeds maximum length
        if (id.length > 9) {
            return next(IdValidationError.wrongLength());
        }

        // Ensure ID contains only numbers
        if (!/^\d+$/.test(id)) {
            return next(IdValidationError.incorrectInput());
        }

        next();
    }
}

module.exports = { IdValidationError, validateId: IdValidationError.validateId };
