const mongoose = require('mongoose')
const Semester = require('./Semester').schema

const FileSchema = new mongoose.Schema({
	name: String,
	size: Number,
	key: String,
	url: String,
	type: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
})

const ClassSchema = new mongoose.Schema({
	name: { type: String, required: [true, "A title plz."] },
	image: FileSchema,
	semesters: [Semester],
	createdAt: {
		type: Date,
		default: Date.now
	}
})

FileSchema.pre('save', function() {
	if(!this.url)
		this.url = `${process.env.APP_URL}/files/${this.key}`
})

FileSchema.pre('remove', function() {
	if(process.env.STORAGE_TYPE === 's3'){
		return s3.deleteObject({
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: this.key
		}).promise()
	}else{
		return promisify(fs.unlink)(path.resolve(__dirname, '..', '..', 'tmp', 'uploads', this.key))
	}
})

module.exports = mongoose.model("Class", ClassSchema)