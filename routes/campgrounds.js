var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
	// GET ALL CAMPGROUNDS FROM DB
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index", {campgrounds:allCampgrounds});
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
	var newCampground = {name: name, image: image, description: desc, author: author};
	// Create a new campground and save to DB
	Campground.create(newCampground, function(err, campground){
		if(err){
			console.log(err);
		}else{
			console.log("NEWLY CREATED CAMPGROUND: ");
			console.log(campground);
		}
	})
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

// RESTFUL: NEW
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// RESTFUL: SHOW
router.get("/:id", function(req, res){
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err || !foundCampground){
			console.log(err);
			req.flash("error", "Sorry, that campground does not exist!");
		}else{
			// render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){

	Campground.findById(req.params.id, function(err, foundCampground){
		res.render("campgrounds/edit", {campground : foundCampground});

	});	
	
});

// UPDATE CAMPGROUND ROUTE
router.put("/:id/", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		}else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res, next){
	Campground.findById(req.params.id, function(err, campground){
		if(err) return next(err);
		campground.remove();
		res.redirect("/campgrounds");
	})
});


module.exports = router;