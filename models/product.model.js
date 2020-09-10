const mongoose = require('mongoose');
const { Schema } = mongoose;
const slugify = require('slugify');
const mongooseSlugPlugin = require('mongoose-slug-plugin');
 
const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        tags: [
            {
                type: String,
                required: true,
            },
        ],
        dateCreated: {
            type: Date,
            required: true,
            default: Date.now(),
        },
        status: {
            type: String,
            enum: ['profitting-already', 'not-profitting-already'],
            required: true,
        },
        profitGenerated: {
            type: Number, // depends on the status of product if already making profit
        },
        amountNeeded: {
            type: Number,
            required: true,
        },
        productOwner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        investors: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            }
        ],
    },
    {
        timestamps: true,
    }
);

productSchema.plugin(mongooseSlugPlugin, { tmpl: '<%=name%>', slug: slugify });

module.exports = mongoose.model('Product', productSchema);
