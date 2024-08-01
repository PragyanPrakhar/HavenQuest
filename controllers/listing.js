const Listing=require("../models/listing.js");

//Index Route
module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

//New Route
module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
};

//Show Route
module.exports.showListing=async (req, res) => {
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
module.exports.createListing=async (req, res, next) => {
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save(); 
    req.flash("success", "New Listing Created !");
    res.redirect("/listings");
};

//Edit Route
module.exports.renderEditForm=async (req, res) => {
    // let { id } = req.params;
    const listing = await Listing.findById(req.params.id);
    console.log(listing);
    if (!listing) {
        req.flash("error", "Requested Listing does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};

//Update Route
module.exports.updateListing=async (req, res) => {
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
};

//Delete Route
module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedList = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted !");
    res.redirect("/listings");
};