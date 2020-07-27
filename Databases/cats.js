var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/cat_app", {
				 useNewUrlParser: true,
				 useUnifiedTopology: true
				 }).then(() => console.log('Connected to DB!')).catch(error => console.log(error.message));

// design a pattern for the data
var catSchema = new mongoose.Schema({
	name: String,
	age: Number,
	temperament: String
});

// "Cat" here is the singular virsion of our data collection's name
// mongoose will automatically name our collection in database as "Cats"
var Cat = mongoose.model("Cat", catSchema);

// adding a new cat to the DB

var george = new Cat({
	name: "Mrs.Norris",
	age: 7,
	temperament: "Evil"
});

// the function included is a CALLBACK function that will be invoked after finishing "save" operation
// george.save(function(err, cat){
// 	if(err){
// 		console.log("SOMETHING WENT WRONG!");
// 	}else{
// 		console.log("WE JUST SAVED A CAT TO THE DB: ");
// 		console.log(cat);
// 	}
// });

Cat.create({
	name: "Snow White",
	age: 10,
	temperament: "Bland"
}, function(err, cat){
	if(err){
		console.log(err);
	}else{
		console.log(cat);
	}
})

// retrieve all cats from the DB and console.log each one
Cat.find({}, function(err, cats){
	if(err){
		console.log("SOMETHING WENT WRONG!");
		console.log(err);
	}else{
		console.log("ALL THE CATS...");
		console.log(cats);
	}
})

