const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");
const MONGO_URL = "mongodb://127.0.0.1:27017/HavenQuest";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync");
const ExpressError = require("./utils/ExpressError");
const {listingSchema}=require("./schema.js")
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
main()
    .then(() => {
        console.log("Connected to DB");
        console.log("mango");
    })
    .catch((err) => {
        console.log(err);
    });
async function main() {
    {
        await mongoose.connect(MONGO_URL);
    }
}
app.get("/", (req, res) => {
    res.send("Hi, I am root!");
});

//Validate Listing 

const validateListing = (req, res,next) => {
    let {error}=listingSchema.validate(req.body);
    if(error)
    {
        let errMsg=error.details.map((el)=>el.message).join(",")
        throw new ExpressError(400,errMsg)
    }
    else
    {
        next();
    }

}

//Index Route 
app.get(
    "/listings",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show Route
app.get(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", { listing });
    })
);

//Create Route
app.post(
    "/listings",validateListing,
    wrapAsync(async (req, res, next) => {
        let { title, description, image, price, country, location } = req.body;
        const newListing = new Listing({
            title,
            description,
            image,
            price,
            country,
            location,
        });
        await newListing.save();
        res.redirect("/listings");
    })
);

// Edit Route
app.get(
    "/listings/:id/edit",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);

//Update Route
app.put(
    "/listings/:id",validateListing,
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
        res.redirect("/listings");
    })
);

//Delete Route
app.delete(
    "/listings/:id",
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        let deletedList = await Listing.findByIdAndDelete(id);
        res.redirect("/listings");
    })
);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found !"));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went Wrong" } = err;
    res.status(statusCode).render("error.ejs", { err });
});

app.listen(8888, () => {
    console.log("Server is listening to the port 8888");
});
