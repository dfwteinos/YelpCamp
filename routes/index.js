var express  = require("express"),
	router   = express.Router(),
	passport = require("passport"),
	User 	 = require("../models/user");


// Root Route
router.get("/", function(req, res){
	res.render("landing");
});


//show the register form
router.get("/register", function(req, res){
	res.render("register");
});
// handle sing up logic
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp " + user.username);
			res.redirect("/campgrounds");
		})
	});
});

// show login form
router.get("/login", function(req, res){
	// We are passing the flash message key ("error" - which is connected to the actual message)
	//res.render("login", {message: req.flash("error")});
	// => we don't do that cause we would have to pass it to every template => app.js
	res.render("login");
});
// handle login logic
router.post("/login", passport.authenticate("local",
	{
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res){
});

// logout route
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged You Out!");
	res.redirect("/campgrounds");
});


module.exports = router;