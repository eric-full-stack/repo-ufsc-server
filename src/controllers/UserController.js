const User = require('../models/User').model
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function generateToken(user) {
	return jwt.sign({id: user.id, email: user.email, type: user.type}, process.env.SECRET, {
		expiresIn: 86400
	})
}

class UserController {

	async register(req, res) {
		try{
			const { name, email, password, type } = req.body
			if ( await User.findOne({email}))
				return res.status(400).send({error: 'User already exists.'})

			const user = await User.create({
				name,
				email,
				password,
				type,
			}).then((user) => {
				user.password = undefined
				res.send({user, token: generateToken(user)}) 
			})
			.catch(err => {
				console.log(err)
				return res.status(400).send({error: 'Registration failed.'})
			})
		}catch(err){
			console.log(err)
		}
	}

	async authenticate(req, res) {
		const { email, password } = req.body
		const user = await User.findOne({email}).select('+password')
		if(!user)
			return res.status(400).send({error: 'User not found'})
		if(!await bcrypt.compare(password, user.password))
			return res.status(400).send({error: 'Invalid password'})

		user.password = undefined

		res.send({user, token: generateToken(user)})
	}

}

module.exports = new UserController()