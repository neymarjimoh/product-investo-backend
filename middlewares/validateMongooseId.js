const mongoose = require("mongoose");
const { Types: { ObjectId } } = mongoose;

const validateUserId = (req, res, next) => {
    const { userId } = req.params;
    // check if the mongoose id is valid or not
    const isValidId = ObjectId.isValid(userId) && (new ObjectId(userId)).toString() === userId;
    if (isValidId) {
        return next();
    } else {
        return res.status(422).json({
            errors: {
                message: "Ensure you enter a valid ID",
            },
        });
    }
};

const validateProfileId = (req, res, next) => {
    const { profileId } = req.params;
    // check if the mongoose id is valid or not
    const isValidId = ObjectId.isValid(profileId) && (new ObjectId(profileId)).toString() === profileId;
    if (isValidId) {
        return next();
    } else {
        return res.status(422).json({
            errors: {
                message: "Ensure you enter a valid ID",
            },
        });
    }
};

module.exports = {
    validateUserId,
    validateProfileId,
};
