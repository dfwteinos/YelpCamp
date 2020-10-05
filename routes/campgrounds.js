var express    = require("express"),
	router	   = express.Router(),
	Campground = require("../models/campground"),
	// If I require just a dirname (no filename) => the index.js file in this dir is automatically required
	middleware = require("../middleware");

// INDEX ROUTE - show all campgrounds
router.get("/", function(req, res){
	Campground.find({},function(err, allCampgrounds){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	});
});

// NEW ROUTE - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
})

// SHOW ROUTE - show more info about one campground
// :id is a var => it has to be AFTER the /campgrounds/new, otherwise new will be treated as id = new
router.get("/:id", function(req, res){
	// Find in the db the object with the requested id
	// Populate the comments on that campground and execute
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


// CREATE ROUTE - add new campground to db
// The post request should have the same route as the get page of all the campgrounds
router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};

	Campground.create(newCampground, function(err, campground){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.redirect("/campgrounds");
		}
	});
})

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground: foundCampground});
	});	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;