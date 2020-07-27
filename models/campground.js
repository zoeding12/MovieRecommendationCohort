var mongoose = require("mongoose");
const Comment = require("./comment");

// SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author:{
		id:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		username: String
	},
	comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

// a pre hook of comments to their corresponding camground when deleted
campgroundSchema.pre("remove", async function(next){
	try{
		await Comment.remove({
			_id: {
				$in: this.comments
			}
		});
		next();
	} catch(err){
		next(err);
	}
	
});

module.exports = mongoose.model("Campground", campgroundSchema);
