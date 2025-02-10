/**
         * Define a custom error class for report validation.
         */
        class ReportValidationError extends Error {
            /**
             * Constructs a new reportValidationError.
             * @param {string} message - The error message.
             * @param {string} type - The type of the error.
             */
            constructor(message, type) {
                super(message);
                this.name = "reportValidationError";
                this.type = type;
            }

            /**
             * Creates a new reportValidationError for missing parameters.
             * @returns {ReportValidationError} The error instance.
             */
            static missingParameters() {
                return new ReportValidationError("Missing parameters", "Missing Parameters");
            }

            /**
             * Creates a new reportValidationError for user not found.
             * @returns {ReportValidationError} The error instance.
             */
            static userNotFound() {
                return new reportValidationError("User not found", "User Not Found");
            }

            static invalidYearFormat() {
                return new ReportValidationError("Invalid year format. Must be a four-digit number (e.g., 2024)", "Invalid Year Format");
            }

            static invalidMonthFormat() {
                return new ReportValidationError("Invalid month format. Must be a number between 1 and 12", "Invalid Month Format");
            }

            static invalidDateCombination() {
                return new ReportValidationError("Invalid date combination. Ensure the year and month are valid", "Invalid Date Combination");
            }


            static validateReportRequest(req, res, next) {
                const { id, year, month } = req.query;

                // בדיקה שכל השדות קיימים
                if (!id || !year || !month) {
                    return next(ReportValidationError.missingParameters());
                }

                // בדיקת תקינות השנה
                if (!/^\d{4}$/.test(year)) {
                    return next(ReportValidationError.invalidYearFormat());
                }

                // בדיקת תקינות החודש (מספר בין 1 ל-12)
                if (!/^(0?[1-9]|1[0-2])$/.test(month)) {
                    return next(ReportValidationError.invalidMonthFormat());
                }

                // בדיקת שילוב שנה-חודש תקין
                const parsedYear = parseInt(year, 10);
                const parsedMonth = parseInt(month, 10);
                const isValidDate = new Date(parsedYear, parsedMonth - 1, 1).getMonth() + 1 === parsedMonth;
                if (!isValidDate) {
                    return next(ReportValidationError.invalidDateCombination());
                }

                next();
            }
        }

        module.exports = { ReportValidationError, validateReportRequest: ReportValidationError.validateReportRequest };

