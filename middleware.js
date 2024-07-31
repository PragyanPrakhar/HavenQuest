const Listing=require("./models/listing.js");
const Review=require("./models/review.js");
const ExpressError = require("./utils/ExpressError");
const { listingSchema,reviewSchema } = require("./schema.js");
module.exports.isLoggedIn =(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirect Url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","You must be logged in to create a new listing");
        return res.redirect("/login");
    }
    next();
}

// if the user is logged in then the req.user will be having an object and if we are not logged in then the req.user will be undefined

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
}

// for authorization of listings

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You aren't the owner of this listing.");
        return res.redirect(`/listings/${id}`);
    }
}

//Validate Listing
module.exports.validateListing=async(req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};


//validate review
module.exports.validateReview=async(req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//is Review Author
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id))
    {
        req.flash("error","You aren't the author of this review.");
        return res.redirect(`/listings/${id}`);
    }
    else
    {
        next();
    }
}