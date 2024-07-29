const express = require("express");
const app = express();
const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/HavenQuest";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport=require("passport");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js");

const reviewRouter = require("./routes/review.js");
const listingRouter = require("./routes/listing.js");
const userRouter=require("./routes/user.js");

app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly: true,// to prevent from cross scripting attacks
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//Here we have initialized the passport.
app.use(passport.session()); //we want user to sign up or sign in only one time in a session not on each and every request. 
passport.use(new LocalStrategy(User.authenticate()));//authenticate() is a static method.
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//to store all the information related to the user into the session is serialize 
// To remove all the information related to the user is known as deserialize.
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

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"students"
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings", listingRouter);

app.use("/listings/:id/reviews", reviewRouter);

app.use("/",userRouter);

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
