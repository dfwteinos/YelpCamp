var express    = require("express"),
	router	   = express.Router({mergeParams: true}),	// Merge the params from the campground and the 
														// comments together => access req.params.id or :id
	Campground = require("../models/campground"),
	Comment	   = require("../models/comment"),
	middleware = require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds/");
		}else{
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments Create
router.post("/", middleware.isLoggedIn, function(req, res){
	Campground.findById(req.params.id, function(err, campground){
		if(err){
			req.flash("error", err.message);
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					req.flash("error", err.message);
					res.redirect("/campgrounds" + campgrounds._id);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT COMMENTS ROUTE
// In app.js we set the link for this js file to be /campgrounds/:id/comments => we cannot use id again for
// comment => we use comment_id!! and wherever we use id it refers to campground._id
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// UPDATE COMMENTS ROUTE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
});

// DELETE COMMENTS ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			req.flash("error", err.message);
			res.redirect("back");
		}else{
			req.flash("success", "Comment deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;