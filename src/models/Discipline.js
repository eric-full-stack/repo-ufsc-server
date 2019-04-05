const mongoose = require('mongoose')
const Post = require('./Post').schema

const DisciplineSchema = new mongoose.Schema({
	title: { type: String, required: [true, "A title plz."] },
	description: String,
	semester: mongoose.Schema.Types.ObjectId,
	posts: [Post],
	createdAt: {
		type: Date,
		default: Date.now
	}
})

exports.model = mongoose.model("Discipline", DisciplineSchema)
exports.schema = DisciplineSchema