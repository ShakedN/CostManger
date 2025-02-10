// Define a custom error class for ID validation
class IdValidationError extends Error {
    constructor(message, type) {
        super(message);
        this.name = "IdValidationError";
        this.type = type;
    }

    static incorrectInput() {
        return new IdValidationError("ID must contain only numbers", "Incorrect Input");
    }

    static wrongLength() {
        return new IdValidationError("ID must be no more than 9 characters long", "Wrong Length");
    }
}

// Middleware to validate the ID
function validateId(req, res, next) {
    const { id } = req.params;

    if (id.length > 9) {
        return next(IdValidationError.wrongLength());
    }

    if (!/^\d+$/.test(id)) {
        return next(IdValidationError.incorrectInput());
    }

    next();
}

