// @desc        Get all users
// @route       GET /api/users
exports.getUsers = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show all users` });
};

// @desc        Get a single user
// @route       GET /api/users/:id
exports.getUser = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Show user ${req.params.id}` });
};

// @desc        Create a user
// @route       POST /api/users
exports.createUser = (req, res, next) => {
    res.status(200).json({ success: true, msg: `Create new user` });
};

// @desc        Update a user
// @route       Put /api/users/:id
exports.updateUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update user ${req.params.id}`,
    });
};

// @desc        Delete a user
// @route       GET /api/users:/id
exports.deleteUser = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete user ${req.params.id}`,
    });
};
