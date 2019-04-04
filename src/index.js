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

	database(){
		mongoose.connect(process.env.MONGO_URL, {
			useNewUrlParser: true
		})
	}

	routes(){
		this.express.use(routes)
	}
}

module.exports = new App().express
