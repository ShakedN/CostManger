/**
         * Define a custom error class for cost validation.
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
             * Creates a new CostValidationError for invalid date.
             * @returns {CostValidationError} The error instance.
             */
            static invalidDate() {
                return new CostValidationError("Cannot add cost for last month after 10 days", "Invalid Date");
            }
        }