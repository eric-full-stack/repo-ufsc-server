const Discipline = require('../models/Discipline')

class DisciplineController {

	async index(req, res) {
		await Discipline.find({}, null, {sort: {title: 1}}, (err, disciplines) => {
			if(err)
				return res.json(err)
			return res.json(disciplines)
		})

	}

	async show(req, res) {
		if(req.params.id){
			return res.json(await Discipline.findById(req.params.id))		
		}
	}

	async create(req, res) {
		const { title, description } = req.body
		const discipline = await Discipline.create({
			title,
			description,
		}).then(() => res.send())
		.catch(err => {
			return res.json(err)
		})
		

	}

	async delete(req, res) {
		const discipline = await Discipline.findById(req.params.id)
		
		await discipline.remove()

		return res.send()
	}
}

module.exports = new DisciplineController()