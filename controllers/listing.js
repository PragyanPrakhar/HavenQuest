const Listing = require("../models/listing.js");
const cloudinary = require("cloudinary").v2;
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//Index Route
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New Route
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Requested Listing does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

//Create Route
module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
};

//Edit Route
module.exports.renderEditForm = async (req, res) => {
    // let {id} = req.params.id;
    // console.log("hello");
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if (!listing) {
        req.flash("error", "Requested Listing does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");

    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//Update Route
module.exports.updateListing = async (req, res) => {
    // let { id } = req.params;
    // let { title, description, image, price, country, location } = req.body.listing;
    // let listing = await Listing.findByIdAndUpdate(id, {
    //     title,
    //     description,
    //     image,
    //     price,
    //     country,
    //     location,
    // });
    // if (typeof req.file !== "undefined") {
    //     let url = req.file.path;
    //     let filename = req.file.filename;
    //     listing.image = { url, filename };
    //     await listing.save();
    // }
    // req.flash("success", "Listing Updated !");
    // res.redirect("/listings");
    let {id} = req.params;
    /* let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send(); */
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    // listing.geometry = response.body.features[0].geometry;
    // const newCoordinates = await geocode(req.body.listing.location);
    let response = await geocodingClient
    .forwardGeocode({
        query: req.body.listing.location,
        limit: 1,
    })
    .send();
    listing.geometry = response.body.features[0].geometry;
    // listing.coordinates = newCoordinates;
    await listing.save();
    if(typeof req.file !== "undefined") {
        let url = req.file.path; 
        let filename = req.file.filename;  
        listing.image = { url, filename }; 
        await listing.save();    
    }
    req.flash("success","Listing Updated!!");
    res.redirect(`/listings/${id}`);
};

//Delete Route
module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
};
