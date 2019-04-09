require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const routes = require('./routes')

class App {
	
	constructor(){
		this.express = express()
		this.server = require('http').Server(this.express)
		this.io = require('socket.io')(this.server)
		
		this.ioConnection()
		this.middlewares()
		this.database()
		this.routes()
	}

	ioConnection(){
		this.io.on('connection', socket => {
			socket.on('connectPost', id => {
				socket.join(id)
			})

			socket.on('disconnectPost', id => {
				socket.leave(id)
			})
		})
	}

	middlewares(){
		this.express.use(cors())
		this.express.use(express.json())
		this.express.use(express.urlencoded({extended: true}))
		this.express.use(morgan('dev'))
		this.express.use('/files', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))
		this.express.use((req, res, next) => {
			req.io = this.io
			return next()
		})
	}

	async database(){
		mongoose.set('useCreateIndex', true);
		const client = await mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true
		})
	}

	routes(){
		this.express.use(routes)
	}
}

module.exports = new App().server
