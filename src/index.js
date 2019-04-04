require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const routes = require('./routes')
const Pusher = require('pusher')

class App {
	
	constructor(){
		this.express = express()
		this.pusher = this.pusher()

		this.middlewares()
		this.database()
		this.routes()
	}

	middlewares(){
		this.express.use(cors())
		this.express.use(express.json())
		this.express.use(express.urlencoded({extended: true}))
		this.express.use(morgan('dev'))
		this.express.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
	}
	pusher(){

		const pusher = new Pusher({
		  appId      : process.env.PUSHER_APP_ID,
		  key        : process.env.PUSHER_APP_KEY,
		  secret     : process.env.PUSHER_APP_SECRET,
		  cluster    : process.env.PUSHER_APP_CLUSTER,
		  useTLS  : true,
		})

		return pusher
	}
	async database(){
		mongoose.set('useCreateIndex', true);
		const client = await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true
		})
		const db = mongoose.connection
		const postsCollection = db.collection('posts')
		const changeStreamPosts = postsCollection.watch({ fullDocument: 'updateLookup' })
		changeStreamPosts.
		on('change', data => {
			let channel = 'posts'
			const post = data.fullDocument
			this.pusher.trigger(
				channel,
				'bdchange', 
				post,
			)
		})
	}

	routes(){
		this.express.use(routes)
	}
}

module.exports = new App().express
