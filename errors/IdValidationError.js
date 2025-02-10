/**
     * Define a custom error class for ID validation.
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
     * Creates a new IdValidationError for wrong length.
     * @returns {IdValidationError} The error instance.
     */
    static wrongLength() {
        return new IdValidationError("ID must be no more than 9 characters long", "Wrong Length");
    }

    /**
     * Creates a new IdValidationError for incorrect input and wrong length.
     * @returns {IdValidationError} The error instance.
     */
    static incorrectInput_wrongLength() {
        return new IdValidationError("ID must be no more than 9 characters long and contain only numbers", "Incorrect Input and Wrong Length");
    }

    /**
     * Middleware to validate the ID.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @param {Function} next - The next middleware function.
     */
    function

    validateId(req, res, next) {
        const {id} = req.params;
        if ((id.length > 9) && (!/^\d+$/.test(id))) {
            return next(IdValidationError.incorrectInput_wrongLength());
        }
        if (id.length > 9 && !/^\d+$/.test(id)) {
            return next(IdValidationError.wrongLength());  // Pass the error to next()
        }

        if (!/^\d+$/.test(id) && id.length <= 9) {
            return next(IdValidationError.incorrectInput());  // Pass the error to next()
        }

        next();  // Continue to the next middleware or route handler
    }
}