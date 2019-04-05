const Class = require('../models/Class')

class ClassController {

	async index(req, res) {
		await Class.find({}, null, {sort: {name: 1}}, (err, classes) => {
			if(err)
				return res.json(err)
			return res.json(classes)
		})

	}

	async show(req, res) {
		if(req.params.id){
			return res.json(await Class.findById(req.params.id))		
		}
	}

	async create(req, res) {
		const { name } = req.body
		const semesters = JSON.parse(req.body.semesters)
		const { file } = req
		var image =  {name: file.originalname, size: file.size, key: file.key, type: file.mimetype, url: file.location || ''}
		const classObj = await Class.create({
			name,
			image,
			semesters
		}).then(() => res.send())
		.catch(err => {
			return res.json(err)
		})
		

	}

	async delete(req, res) {
		const classObj = await Class.findById(req.params.id)
		
		await classObj.remove()

		return res.send()
	}
}

module.exports = new ClassController()