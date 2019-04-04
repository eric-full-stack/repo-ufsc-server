const mongoose = require('mongoose')


const DisciplineSchema = new mongoose.Schema({
	title: { type: String, required: [true, "A title plz."] },
	description: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

module.exports = mongoose.model("Discipline", DisciplineSchema)