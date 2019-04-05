const Semester = require('../models/Semester').model

class SemesterController {

	async index(req, res) {
		await Semester.find({}, null, {sort: {name: 1}}, (err, semesters) => {
			if(err)
				return res.json(err)
			return res.json(semesters)
		})
	}

	async show(req, res) {
		if(req.params.id){
			return res.json(await Semester.findById(req.params.id))		
		}
	}

	async create(req, res) {
		const { name, disciplines } = req.body
		const semester = await Semester.create({
			name,
			disciplines,
		}).then((obj) => { return res.json(obj)})
		.catch(err => {
			return res.json(err)
		})
	}

	async delete(req, res) {
		const semester = await Semester.findById(req.params.id)
		
		await semester.remove()

		return res.send()
	}
}

module.exports = new SemesterController()