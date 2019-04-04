const mongoose = require('mongoose')
const aws = require('aws-sdk')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')

const s3 = new aws.S3()

function formatDate(fullDate) {
	const date = `${fullDate.getDate()}/${fullDate.getMonth()}/${fullDate.getFullYear()}`
	const hour = `${fullDate.getHours()}:${fullDate.getMinutes()}:${fullDate.getSeconds()}`
	return `${date} ${hour}`
}

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

const PostSchema = new mongoose.Schema(
	{
		title: { type: String, required: [true, "A title plz."] },
		description: {type: String, required: [true, "Describe something."] },
		discipline: String,
		teacher: String,
		tags: [String],
		files: [FileSchema],
		likes: Number,
		createdAt: {
			type: Date,
			default: Date.now,
			get: formatDate
		}
	},{
		toObject : {getters: true},
	    toJSON : {getters: true}
	}
)
PostSchema.index({'$**': 'text'});

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
module.exports = mongoose.model("Post", PostSchema)