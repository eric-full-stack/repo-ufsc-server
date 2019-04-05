const Post = require('../models/Post').model
const Discipline = require('../models/Discipline').model
const Semester = require('../models/Semester').model
const Class = require('../models/Class').model
const fs = require('fs')
const archiver = require('archiver')
const path = require('path')
const aws = require('aws-sdk')
const btoa = require('btoa')
var ObjectId = require('mongoose').Types.ObjectId

class PostController {

	async index(req, res) {
		if(!req.query.search){
			const posts = await Post.find({}, null, {sort: {likes: -1, createdAt: -1}})
			return res.json(posts)
		}else{
			const posts = await Post.find({$text: {$search: req.query.search}}, null, {sort: {likes: -1, createdAt: -1}})
			return res.json(posts)
		}

	}

	async getByDiscipline(req, res) {
		const posts = await Post.find({$text: {$search: ObjectId(req.params.id)}}, null, {sort: {likes: -1, createdAt: -1}})
		return res.json(posts)
	}

	async show(req, res) {
		if(req.params.id){
			return res.json(await Post.findById(req.params.id))		
		}else{
			return res.status(400).end('Invalid ID')
		}
	}

	async like(req, res){
		if(req.params.id){
			const post = await Post.findById(req.params.id)
			post.likes = post.likes+1 || 1
			await post.save()

			return res.json({likes: post.likes})

		}else{
			return res.status(400).end('Invalid ID')
		}
	}

	async unlike(req, res){
		if(req.params.id){
			const post = await Post.findById(req.params.id)
			post.likes = post.likes-1 || 0
			await post.save()

			return res.json({likes: post.likes})

		}else{
			return res.status(400).end('Invalid ID')
		}
	}

	async downloadFiles(req, res){
		
		if(req.params.id){
			
			const post = await Post.findById(req.params.id)
			var archive =  archiver('zip', {
			  zlib: { level: 9 }
			})	

			const zippath = path.resolve(__dirname, '..', '..', 'tmp', 'zip', `${post._id}.zip`)
			
			const output = fs.createWriteStream(zippath)
			archive.pipe(output)
			const promises = []
			const fileNames = []
			if(process.env.STORAGE_TYPE === 'local'){
				for ( const file of post.files){
					archive.append(fs.createReadStream(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${file.key}`)),{name: file.name})
				}
			}else{
				var bucket = new aws.S3({params: {
					Bucket: process.env.AWS_BUCKET_NAME,
					key: process.env.AWS_ACCESS_KEY_ID,
				}});

				post.files.map((file) => {
					fileNames.push(file.name)
					promises.push(bucket.getObject({
					  Key: file.key
					}).promise())
				})				
			}
			
			return Promise.all(promises).then(data => {
		        archive.on('error', e => reject(e));
		        archive.on('warning', e => {
		            if (e.code !== 'ENOENT') {
		                reject(e);
		            }
		        });
		        data.map((thisFile, index) => {
			    	archive.append(thisFile.Body, { name: fileNames[index] })
			    })
			    archive.finalize();
		        setTimeout( () => res.download(zippath, 'files.zip'), 1000)
		        
		    });
						
		}else{
			return res.status(400).end('Invalid ID')
		}
	}

	async create(req, res) {
		const { title, description, tags } = req.body
		const teacher = JSON.parse(req.body.teacher)
		const discipline = JSON.parse(req.body.discipline)
		var files = req.files.map(file => {
			return {name: file.originalname, size: file.size, key: file.key, type: file.mimetype, url: file.location || ''}
		})
		
		const post = Post.create({
			title,
			description,
			teacher,
			discipline,
			tags,
			files
		}).then(async (postObj) => {
			const discipline = await Discipline.findById(postObj.discipline._id).then(async (obj) => {
				obj.posts.push(postObj)
				await obj.save()
			})
			return res.send()
			
		})
		.catch(err => {
			return res.json(err)
		})
	}

	async delete(req, res) {
		try{
			const post = await Post.findById(req.params.id)
			
			await post.remove()

			return res.send()
		}catch(err){
			return res.status(400).end(err)
		}
	}

}

module.exports = new PostController()