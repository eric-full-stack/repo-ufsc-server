const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	console.log(req.url)
	const authHeader = req.headers.authorization

	if(!authHeader)
		return res.status(401).send({error: 'No token provided'})

	const parts = authHeader.split(' ')

	if(!parts.length === 2)
		return res.status(401).send({error: 'Token error'})

	const [scheme, token] = parts

	if(!/^Bearer$/i.test(scheme))
		return res.status(401).send({error: 'Token error'})

	jwt.verify(token, process.env.SECRET, (err, decoded) => {
		if(err)
			return res.status(401).send({error: 'Token invalid'})
		if(!(decoded.type === 'admin' && decoded.email === 'ericrprates@gmail.com'))
			return res.status(401).send({error: 'Permission denied'})
		req.userId = decoded.id

		return next()

	})
}