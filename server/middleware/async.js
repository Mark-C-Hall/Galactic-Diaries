/*
 * Middleware method for async controller methods. Assists in catching errors
 * and sending to error handling middleware.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
