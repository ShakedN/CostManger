// Define a custom error class for report validation
class ReportValidationError extends Error {
    constructor(message, type) {
        super(message);
        this.name = "ReportValidationError";
        this.type = type;
    }

    static missingParameters() {
        return new ReportValidationError("Missing parameters", "Missing Parameters");
    }

    static userNotFound() {
        return new ReportValidationError("User not found", "User Not Found");
    }
}