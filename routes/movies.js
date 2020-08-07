var express = require("express");
var router = express.Router();
var Movie = require("../models/movie");
var middleware = require("../middleware");

router.get("/", function(req, res){
	// GET ALL MOVIES FROM DB
	Movie.find({}, function(err, allMovies){
		if(err){
			console.log(err);
		}else{
			console.log(allMovies);
			res.render("movies/index", {movies:allMovies});
		}
	})
	
});

// RESTFUL: CREATE
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrouds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newMovie = {name: name, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Movie.create(newMovie, function(err, movie){
		if(err){
			console.log(err);
		}else{
			console.log("NEWLY CREATED MOVIE: ");
			console.log(movie);
		}
	})
	// redirect back to movies page
	res.redirect("/movies");
});

// RESTFUL: NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("movies/new");
});

// RESTFUL: SHOW
router.get("/:id", function(req, res){
	// find the campground with provided ID
	Movie.findById(req.params.id).populate("comments").exec(function(err, foundMovie){
		if(err || !foundMovie){
			console.log(err);
			req.flash("error", "Sorry, that campground does not exist!");
		}else{
			// render show template with that campground
			res.render("movies/show", {movie: foundMovie});
		}
	});
});

// EDIT MOVIE ROUTE
router.get("/:id/edit", middleware.checkMovieOwnership, function(req, res){

	Movie.findById(req.params.id, function(err, foundMovie){
		res.render("movies/edit", {movie : foundMovie});

	});	
	
});

// UPDATE MOVIE ROUTE
router.put("/:id/", middleware.checkMovieOwnership, function(req, res){
	Movie.findByIdAndUpdate(req.params.id, req.body.movie, function(err, updatedMovie){
		if(err){
			res.redirect("/movies");
		}else{
			res.redirect("/movies/" + req.params.id);
		}
	})
})

// DESTROY MOVIE ROUTE
router.delete("/:id", middleware.checkMovieOwnership, function(req, res, next){
	Movie.findById(req.params.id, function(err, movie){
		if(err) return next(err);
		movie.remove();
		res.redirect("/movies");
	})
});


module.exports = router;