const mongoose = require('mongoose')


const TeacherSchema = new mongoose.Schema({
	name: { type: String, required: [true, "A name plz."] },
	createdAt: {
		type: Date,
		default: Date.now
	}
})

exports.model = mongoose.model("Teacher", TeacherSchema)
exports.schema =TeacherSchema