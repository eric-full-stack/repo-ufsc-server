const Post = require('../models/Post')
const fs = require('fs');
const archiver = require('archiver');
const path = require('path')

class PostController {

	async index(req, res) {
		if(req.query.search === 'false'){
			const posts = await Post.find({}, null, {sort: {likes: -1, createdAt: -1}})
			return res.json(posts)
		}else{
			const posts = await Post.find({$text: {$search: req.query.search}}, null, {sort: {likes: -1, createdAt: -1}})
			return res.json(posts)
		}

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
			if (fs.existsSync(zippath)) {
				return res.download(zippath, `${post.title}.zip`)
			}
			const output = fs.createWriteStream(zippath)
			archive.pipe(output)

			for ( const file of post.files){
				archive.append(fs.createReadStream(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', `${file.key}`)),{name: file.name})
			}
			
			return new Promise((resolve, reject) => {
		        archive.on('error', e => reject(e));
		        archive.on('warning', e => {
		            if (e.code !== 'ENOENT') {
		                reject(e);
		            }
		        });
		        output.on('close', resolve);
		        archive.finalize();
		        setTimeout( () => res.download(zippath, 'files.zip'), 1000)
		        
		    });
						
		}else{
			return res.status(400).end('Invalid ID')
		}
	}

	async create(req, res) {
		const { title, description, teacher, discipline, tags } = req.body
		var files = req.files.map(file => {
			return {name: file.originalname, size: file.size, key: file.key, type: file.mimetype, url: file.location || ''}
		})
		
		const post = await Post.create({
			title,
			description,
			teacher,
			discipline,
			tags,
			files
		}).then(() => res.send())
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

	async search(req, res) {
		
	}
}

module.exports = new PostController()