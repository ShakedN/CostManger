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
            static missingParameters() {
                return new CostValidationError("Missing required fields: description, category, userid, sum", "Missing Parameters");
            }

            static invalidCategory() {
                return new CostValidationError("Invalid category. Allowed values: food, health, housing, sport, education", "Invalid Category");
            }

            static invalidSum() {
                return new CostValidationError("Sum must be a positive number", "Invalid Sum");
            }

            static invalidDateFormat() {
                return new CostValidationError("Invalid date format. Use YYYY-MM-DD", "Invalid Date Format");
            }

            static invalidDateValue() {
                return new CostValidationError("Invalid date. Ensure it is a real calendar date in YYYY-MM-DD format.", "Invalid Date");
            }

            static outdatedDate() {
                return new CostValidationError("Date is too old. Cannot add costs older than 10 days from last month.", "Outdated Date");
            }

            static validateCost(req, res, next) {
                const { description, category, userid, sum, date } = req.body;
                const validCategories = ['food', 'health', 'housing', 'sport', 'education'];

                // בדיקה שכל השדות קיימים
                if (!description || !category || !userid || !sum) {
                    return next(CostValidationError.missingParameters());
                }

                 // בדיקה שהקטגוריה חוקית
                if (!validCategories.includes(category)) {
                      return next(CostValidationError.invalidCategory())
                }

                  // בדיקה שהסכום חוקי
                if (typeof sum !== "number" || sum <= 0) {
                    return next(CostValidationError.invalidSum());
                }

                const currentDate = new Date();
                let costDate = date ? new Date(date) : currentDate;

                // בדיקה שהתאריך חוקי ולא מכיל ערכים לא ריאליים
                if (isNaN(costDate.getTime())) {
                    return next(CostValidationError.invalidDateValue());
                }

                // בדיקה שהתאריך בפורמט תקין (YYYY-MM-DD)
                const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
                if (date && !dateRegex.test(date)) {
                    return next(CostValidationError.invalidDateFormat());
                }

                // בדיקה שהתאריך קיים בלוח השנה
                if (date) {
                    const [year, month, day] = date.split("-").map(Number);
                    const parsedDate = new Date(year, month - 1, day);
                    if (parsedDate.getFullYear() !== year || parsedDate.getMonth() + 1 !== month || parsedDate.getDate() !== day) {
                        return next(CostValidationError.invalidDateValue());
                    }
                }

                // בדיקה שהתאריך לא ישן מדי
                const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
                const tenDaysAgo = new Date(currentDate);
                tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

                if (costDate < lastMonth && costDate < tenDaysAgo) {
                    return next(CostValidationError.outdatedDate());
                }
                next();
            }

        }
        module.exports = { CostValidationError, validateCost: CostValidationError.validateCost };

