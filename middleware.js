module.exports.isLoggedIn =(req,res,next)=>{
    // console.log(req.user);
    // console.log(req.path,".....",req.originalUrl);
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