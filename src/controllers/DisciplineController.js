const Discipline = require('../models/Discipline').model
var ObjectId = require('mongoose').Types.ObjectId

class DisciplineController {

	async index(req, res) {
		await Discipline.find({}, null, {sort: {title: 1}}, (err, disciplines) => {
			if(err)
				return res.json(err)
			return res.json(disciplines)
		})

	}

	async getBySemester(req, res) {
		await Discipline.find({semester: ObjectId(req.params.id)}, null, {sort: {name: 1}}, (err, disciplines) => {
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

	async update(req, res) {
		if(req.params.id){
			let discipline = await Discipline.findById(req.params.id)
			discipline.semester = req.body.semester
			discipline.save()
			return res.send()
		}
	}

	async create(req, res) {
		const { title, description, semester } = req.body
		const discipline = await Discipline.create({
			title,
			description,
			semester
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