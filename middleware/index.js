var Movie = require("../models/movie");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.checkMovieOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Movie.findById(req.params.id, function(err, foundMovie){
		  if(err || !foundMovie){
			  console.log(err);
			  req.flash('error', 'Sorry, that movie does not exist!');
			  res.redirect('/movies');
		  } else if(foundMovie.author.id.equals(req.user._id) || req.user.isAdmin){
			  req.movie = foundMovie;
			  next();
		  } else {
			  req.flash('error', 'You don\'t have permission to do that!');
			  res.redirect('/movies/' + req.params.id);
		  }
		});
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
		  if(err || !foundComment){
			  console.log(err);
			  req.flash('error', 'Sorry, that comment does not exist!');
			  res.redirect('back');
		  } else if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
			  req.comment = foundComment;
			  next();
		  } else {
			  req.flash('error', 'You don\'t have permission to do that!');
			  res.redirect('/campgrounds/' + req.params.id);
		  }
		});
		
	}else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that")
	res.redirect("/login");
}

module.exports = middlewareObj;