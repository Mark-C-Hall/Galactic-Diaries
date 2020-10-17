/*
 * Middleware method for handling errors and calling the error response object.
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const ErrorResponse = require('../utils/ErrorResponse');

const errorHandler = (err, req, res, next) => {
    // Select errors
    let error = { ...err };
    error.message = err.message;

    // Log error to console
    if (process.env.NODE_ENV === 'development') {
        console.log(err);
    }

    // Mongoose bad Object id
    if (err.name === 'CastError') {
        const message = `Resource not found.`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const key = Object.values(err.keyValue);
        const message = `Duplicate field value entered: ${key}.`;
        error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(error.errors).map((val) => val.message);
        error = new ErrorResponse(message, 400);
    }

    // All other errors
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
