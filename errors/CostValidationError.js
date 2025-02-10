// Define a custom error class for cost validation
class CostValidationError extends Error {
    constructor(message, type) {
        super(message);
        this.name = "CostValidationError";
        this.type = type;
    }

    static invalidDate() {
        return new CostValidationError("Cannot add cost for last month after 10 days", "Invalid Date");
    }
}