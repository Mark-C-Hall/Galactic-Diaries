/*
 * Creates Error Response object used in error handling.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

module.exports = ErrorResponse;
