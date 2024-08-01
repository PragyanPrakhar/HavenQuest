const Joi = require("joi");
const review = require("./models/review");
const listing = require("./models/listing");

// const imageSchema = Joi.object({
//     url: Joi.string().uri().required(),  // Validates that the URL is a valid URI
//     filename: Joi.string().required(),  // Ensures filename is provided
// });

// const listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         /* image: Joi.string().required(), */
//         image: imageSchema.required(),
//         price: Joi.number().required(),
//         country: Joi.string().required(),
//         location: Joi.string().required()
//     }).required()
// });

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        image: Joi.string().allow("", null),
        price: Joi.number().required(),
        country: Joi.string().required(),
        location: Joi.string().required(),
    }).required(),
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = { listingSchema, reviewSchema };
