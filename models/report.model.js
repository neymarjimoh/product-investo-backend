const mongoose = require('mongoose');
const { Schema } = mongoose;

const reportSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        reporting: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Report', reportSchema);
