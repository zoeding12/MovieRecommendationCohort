var express = require("express"),
    app = express(),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose"),
	flash = require("connect-flash"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Movie = require("./models/movie"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds"),
	methodOverride = require("method-override"),
	port = process.env.PORT || 3000;

var commentRoutes = require("./routes/comments"),
	movieRoutes = require("./routes/movies"),
	indexRoutes = require("./routes/index");

//"mongodb://localhost:27017/yelp_camp"
//"mongodb+srv://admin:Qwer1234@cluster0.1ld5b.mongodb.net/yelp_camp?retryWrites=true&w=majority"
console.log(process.env.DATABASEURL);
mongoose.connect(process.env.DATABASEURL, {
				 useNewUrlParser: true,
				 useUnifiedTopology: true
				 }).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "This is my secret line",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

// require routes
app.use(indexRoutes);
app.use("/movies", movieRoutes);
app.use("/movies/:id/comments", commentRoutes);




app.listen(port, function(){
	console.log("The YelpCamp server has started!")
});