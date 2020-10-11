/*
 * Middleware method for applying advanced queries. Params are:
 * - Select
 * - Sort
 * - Page
 * - Limit
 *
 * Galactic Diaries
 * Valencia College
 * Fall 2020
 */

const advancedResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude from query
    const removedFields = ['select', 'sort', 'page', 'limit'];

    // Loop over exclude Fields and remove from query
    removedFields.forEach((field) => delete reqQuery[field]);

    // Find resource
    query = model.find(reqQuery);

    // Select
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query.sort(sortBy);
    } else {
        query.sort('-createdAt');
    }

    // Pagination
    const page = parseInt(req.query.page, 10 || 1);
    const limit = parseInt(req.query.limit, 10 || 10);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query.skip(startIndex).limit(limit);

    // Populate results with relationships
    if (populate) {
        console.log(populate);
        query = query.populate(populate);
    }

    // Execute query
    const results = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit,
        };
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit,
        };
    }

    // Create respone object
    res.advancedResults = {
        sucess: true,
        count: results.length,
        pagination,
        data: results,
    };

    next();
};

module.exports = advancedResults;
