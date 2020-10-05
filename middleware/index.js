var Campground = require("../models/campground"),
	Comment	   = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	// Check if user is logged in
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", err.message);
				// This will take the user back to where they came from (the prev page)
				res.redirect("back");
			}else{
				// Check if the user owns the campground
				// If we console.log foundCampground.author.id and req.user._id they look they same
				// but foundCampground.author.id is an oblject while req.user._id is a string!
				// So we use a mongoose method to compare them
				if(foundCampground.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}	
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	// Check if user is logged in
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				req.flash("error", err.message);
				// This will take the user back to where they came from (the prev page)
				res.redirect("back");
			}else{
				// Check if the user owns the comment
				// If we console.log foundComment.author.id and req.user._id they look they same
				// but foundComment.author.id is an oblject while req.user._id is a string!
				// So we use a mongoose method to compare them
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}else{
					req.flash("error", "You don't have permission to do that");
					res.redirect("back");
				}
			}
		});	
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}	
};

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	// This won't be executed before the next order runs => firstly we will be redirected and then
	// the flash will appear on the new page we were redirected to => req.flash doesn't desplay a msg
	// We have to go to the redirecting page and handle the message there to desplay it!
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};

module.exports = middlewareObj;