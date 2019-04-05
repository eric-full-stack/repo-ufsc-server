const mongoose = require('mongoose')
const Discipline = require('./Discipline').schema


const SemesterSchema = new mongoose.Schema({
	name: { type: String, required: [true, "A name plz."] },
	disciplines: [Discipline],
	createdAt: {
		type: Date,
		default: Date.now
	}
})

exports.model = mongoose.model("Semester", SemesterSchema)
exports.schema = SemesterSchema