const express		 = require("express"),
	  port			 = process.env.PORT || 3000,
	  fs			 = require("fs"),
	  https			 = require("https"),
	  app			 = express(),
	  bodyParser	 = require("body-parser"),
	  mongoose		 = require("mongoose"),
	  flash			 = require("connect-flash"),
	  passport		 = require("passport"),
	  localStradegy  = require("passport-local"),
	  methodOverride = require("method-override"),
	  Campground	 = require("./models/campground"),
	  Comment		 = require("./models/comment"),
	  User			 = require("./models/user"),
	  seedDB		 = require("./seeds");

// Requiring Routes
var campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes	 = require("./routes/comments"),
	indexRoutes		 = require("./routes/index");

//seedDB();				// seed the database
//mongoose.connect("mongodb://localhost/yelp_camp", {
//mongoose.connect("mongodb+srv://dbUser:denpairnoumeptuxio@cluster0.m2omw.mongodb.net/yelpcamp?retryWrites=true&w=majority", {

// Just in case our env var is not set or sth goes wrong with it, we add a backup url
var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// We use the same env var name both locally and on heroku, each with it's respective db url
// so that they always run on their own seperate dbs
mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
})
.then(() => console.log("Connected to yelp_camp db!"))
.catch(error => console.log(error.message));


// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "I need vacationnn",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStradegy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));		// to parse 'campgrounds' table
app.use(express.static(__dirname + "/public"));		//__dirname is the directory name where the script runs
app.use(methodOverride("_method"));
app.use(flash());

// It will be passed through all the routes => we don't have to do it manually
// next(); has to be called afterwards so as to move on to the next middleware (usually the route handler)
app.use(function(req, res, next){
	// req.user is object with info about the currently logged in user (if there is one)
	res.locals.currentUser = req.user;
	// If there's anything in the flash, we'll have access to it in any template under var message
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


/*Campground.create(
	{
		name: "Granite Hill",
		image: "https://pix10.agoda.net/hotelImages/222/2225850/2225850_17051516230052996076.jpg?s=1024x768",
		description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
	}, function(err, campground){
		if(err){
			console.log("Error occured!");
			console.log(err);
		}else{
			console.log("Newly created campground:");
			console.log(campground);
		}
	}
);*/


// We tell our app to use the 3 route files we've required
// We say that all campground routes will start with "/campgrounds" (this affects the campgrounds.js), etc
app.use("/campgrounds", campgroundRoutes);
// In express.Router (comments.js) we have to pass the object {mergeParams: true} so that the :id is found
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);



https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app);


app.listen(port, function(){
	console.log("The YelpCamp Server has started..");
});