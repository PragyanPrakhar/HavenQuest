const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//Validate Listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index Route
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id).populate("reviews");
        if (!listing) {
            req.flash("error", "Requested Listing does not exist");
            res.redirect("/listings");
        }
        res.render("listings/show.ejs", { listing });
    })
);

//Create Route
// router.post(
//     "/",
//     validateListing,
//     wrapAsync(async (req, res, next) => {
//         let { title, description, image, price, country, location } = req.body;
//         const newListing = new Listing({
//             title,
//             description,
//             image,
//             price,
//             country,
//             location,
//         });
//         await newListing.save();
//         res.redirect("/listings");
//     })
// );

// router.post(
//     "/listings",
//     validateListing,
//     wrapAsync(async (req, res, next) => {
//         const { listing } = req.body;
//         const newListing = new Listing(listing);
//         console.log(newListing);
//         await newListing.save();
//         res.redirect("listings");
//     })
// );

router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res, next) => {
        const { listing } = req.body;
        const newListing = new Listing(listing);
        await newListing.save();
        req.flash("success", "New Listing Created !");
        res.redirect("/listings");
    })
);

// Edit Route
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Requested Listing does not exist");
            res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing });
    })
);

//Update Route
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let { title, description, image, price, country, location } = req.body;

        await Listing.findByIdAndUpdate(id, {
            title,
            description,
            image,
            price,
            country,
            location,
        });

        req.flash("success", "Listing Updated !");

        res.redirect("/listings");
    })
);

//Delete Route
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
        req.flash("success", "Listing Deleted !");
        res.redirect("/listings");
    })
);
module.exports = router;
