const User=require("../models/user.js");
module.exports.renderSignupForm=(req, res) => {
    res.render("users/signup.ejs");
};

module.exports.renderLoginForm=(req, res) => {
    res.render("users/login.ejs");
};

module.exports.signup=async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email, password });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to HavenQuest");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.login=async (req, res) => {
    // res.send("Welcome to HavenQuest, You are logged in !")
    req.flash("success", "Welcome back to HavenQuest");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

module.exports.logout=(req, res) => {
    //req.logout is a pre built function provided by the passport.
    req.logout((err) => {
        if (err) {
            return next(err);
        } else {
            req.flash("success", "You are logged out!");
            res.redirect("/listings");
        }
    });
};