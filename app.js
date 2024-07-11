const express = require("express");
const app = express();
const mongoose = require("mongoose");
const ejs = require("ejs");
const Listing = require("./models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/HavenQuest";
main()
    .then(() => {
        console.log("Connected to DB");
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
app.get("/testListing", async (req, res) => {
    let sampleListing = new Listing({
        title: "My new Villa",
        description: "By the beach",
        price: 1200,
        location:"Calangute Goa",
        country:"India",
    });
    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful Testing");
});

app.listen(8080, () => {
    console.log("Server is listening to the port 8080");
});
