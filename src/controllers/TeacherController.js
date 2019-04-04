const Teacher = require('../models/Teacher')

class TeacherController {

	async index(req, res) {
		await Teacher.find({}, null, {sort: {name: 1}}, (err, teachers) => {
			if(err)
				return res.json(err)
			return res.json(teachers)
		})

	}

	async show(req, res) {
		if(req.params.id){
			return res.json(await Teacher.findById(req.params.id))		
		}
	}

	async create(req, res) {
		const { name } = req.body
		const teacher = await Teacher.create({
			name,
		}).then(() => res.send())
		.catch(err => {
			return res.json(err)
		})
		

	}

	async delete(req, res) {
		const teacher = await Teacher.findById(req.params.id)
		
		await teacher.remove()

		return res.send()
	}
}

module.exports = new TeacherController()