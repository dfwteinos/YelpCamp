var mongoose	= require("mongoose"),
	Campground	= require("./models/campground"),
	Comment		= require("./models/comment");

var data = [
	{name: "Cloud's Rest",
	image: "https://flashnews.gr/storage/photos/master/201909/camping.jpg",
	description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt mi ullamcorper, dignissim tortor at, feugiat est. Sed quis laoreet justo. Vestibulum interdum turpis sem, non tincidunt magna dignissim quis. Nam lorem risus, commodo id condimentum nec, dapibus in odio. Phasellus eleifend, dui sagittis imperdiet molestie, justo leo vestibulum purus, et tempus metus leo sit amet lectus. Morbi scelerisque, est id hendrerit lacinia, nisl quam sagittis velit, vitae euismod quam massa posuere libero. Quisque in vestibulum mauris. Proin sed ligula convallis, bibendum mauris ac, semper felis. Suspendisse ultrices eu felis nec fermentum. Cras tincidunt at sem sed luctus. "},
	{name: "Salmon Creek",
	image: "https://www.travelstyle.gr/wp-content/uploads/2018/05/camping-finland.jpg",
	description: "This place is awsome! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt mi ullamcorper, dignissim tortor at, feugiat est. Sed quis laoreet justo. Vestibulum interdum turpis sem, non tincidunt magna dignissim quis. Nam lorem risus, commodo id condimentum nec, dapibus in odio. Phasellus eleifend, dui sagittis imperdiet molestie, justo leo vestibulum purus, et tempus metus leo sit amet lectus. Morbi scelerisque, est id hendrerit lacinia, nisl quam sagittis velit, vitae euismod quam massa posuere libero. Quisque in vestibulum mauris. Proin sed ligula convallis, bibendum mauris ac, semper felis. Suspendisse ultrices eu felis nec fermentum. Cras tincidunt at sem sed luctus. "},
	{name: "Granite Hill",
	image: "https://pix10.agoda.net/hotelImages/222/2225850/2225850_17051516230052996076.jpg?s=1024x768",
	description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent tincidunt mi ullamcorper, dignissim tortor at, feugiat est. Sed quis laoreet justo. Vestibulum interdum turpis sem, non tincidunt magna dignissim quis. Nam lorem risus, commodo id condimentum nec, dapibus in odio. Phasellus eleifend, dui sagittis imperdiet molestie, justo leo vestibulum purus, et tempus metus leo sit amet lectus. Morbi scelerisque, est id hendrerit lacinia, nisl quam sagittis velit, vitae euismod quam massa posuere libero. Quisque in vestibulum mauris. Proin sed ligula convallis, bibendum mauris ac, semper felis. Suspendisse ultrices eu felis nec fermentum. Cras tincidunt at sem sed luctus. "}
];

function seedDB(){
	// Remove all campgrounds
	Campground.deleteMany({}, function(err){
		if(err){
			console.log(err);
		}else{
			console.log("Removed all campgrounds!");
			// Add a few campgrounds, only after all previous campgrounds have been removed
			data.forEach(function(seed){
				Campground.create(seed, function(err, campground){
					if(err){
					console.log(err);
					}else{
						console.log("Added a new campground");
						// Create a comment
						Comment.create({
							text: "This place is great, but I wish there was internet",
							author: "Homer"
						}, function(err, comment){
							if(err){
								console.log(err);
							}else{
								campground.comments.push(comment);
								campground.save();
								console.log("Created a new comment");
							}
						})
					}
				});
			})
		}
	});
};

module.exports = seedDB;