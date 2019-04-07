const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
	name: { type: String, required: [true, "A name plz."] },
	password: { type: String, required: [true, "A password plz."], select: false },
	email: { type: String, required: [true, "A email plz."], unique: true, lowercase: true },
	type: { type: String, required: [true], enum: ['admin', 'user'] },
	likes: [mongoose.Schema.Types.ObjectId],
	createdAt: {
		type: Date,
		default: Date.now
	}
})

UserSchema.pre('save', async function(next){
	if(this.password){
		const hash = await bcrypt.hash(this.password, 15)
		this.password = hash		
	}

	next()
})

exports.model = mongoose.model("User", UserSchema)
exports.schema = UserSchema