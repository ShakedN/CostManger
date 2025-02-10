/**
         * Define a custom error class for report validation.
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
        }