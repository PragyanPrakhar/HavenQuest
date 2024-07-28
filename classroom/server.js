const express = require("express");
const app = express();
// const users = require("../routes/listing.js");
// const posts = require("../routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
    secret: "mysupersecretscreen",
    resave: false,
    saveUninitialized: true,
};
app.use(session(sessionOptions));

app.use(flash());

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    // console.log(req.session);
    req.session.name = name;
    if (name === "anonymous") {
        req.flash("error", "User Not Registered");
    } else {
        req.flash("success", "User registered Successfully");
    }

    res.redirect("/hello");
});

app.get("ghijkl", (req, res) => {
    res.send("Hehehehe");
});

app.get("/hello", (req, res) => {
    console.log(req.flash("success"));
    res.locals.successMsg = req.flash("success");
    res.locals.errorMsg = req.flash("error");
    res.render("page.ejs", {
        name: req.session.name,
    });
});

// app.get("/reqcount", (req, res) => {
//     if (req.session.count) {
//         req.session.count++;
//     } else {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request ${req.session.count} times`);
// });
// app.get("/test",(req,res)=>{
//     res.send("test successfull");
// })

app.listen(8000, () => {
    console.log("Server is listening to the port 8000");
});


