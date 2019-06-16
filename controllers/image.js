const express = require('express');
const router = express.Router();
const image = require("../models/image"); //import user model
//
// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../images/profilePics')
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname)
//     }
// });


// get all images
router.get('/all', function(req, res) {
	console.log('request: get all images')
	image.findAllImages(function (err, doc){
		if (err) {
			console.log('failed to get all images')
			response = {error: 'Failed to get all images'}
		} else {
			response = {data: doc, msg: 'all images found'}
		}
		res.send(response)
	})
})

// get image 
router.get('/:imageId', function(req, res) {
	console.log('request: get image')
	let response = {}
	image.findImageById(req.params.imageId, function(err, doc){
		console.log('GET image:' + req.params.imageId)
		if (err){
			console.log('failed to get image', err)
			response = {error: 'failed to get image'}
		} else {
			response = {data: doc, msg: 'image found'}
		}
		res.send(response)
	})
})

// post image
router.post('/', function(req, res) {
	console.log('request: add image')
	image.addNewImage(req.body, function(err, doc){
		let response = {}
		if (err) {
			console.log('failed to post new image')
			console.log(err)
			response = {error: 'failed to post new image'}
		} else {
			response = {data: doc, msg: 'new image posted'}
		}
		res.send(response)
	})
})

// post new image and store it to server folder
router.post('/save', function(req, res) {
	console.log('request: add and store image')
	image.addStoreNewImage(req.body, function(err, doc){
		let response = {}
		if (err) {
			console.log('failed to post and store new image')
			console.log(err)
			response = {error: 'failed to post and store new image'}
		} else {
			response = {data: doc, msg: 'new image posted and stored'}
		}
	})
})


// update picture
router.patch('/:imageId', function(req, res) {
	console.log('request: update image')
	let response = {}
	image.updateImageById(req.params.imageId, req.body, function(err, doc){
		if (err) {
			console.log('failed to update new image')
			response = {error: 'failed to update new image'}
		} else {
			response = {data: doc, msg: 'image updated'}
		}
		res.send(response)
	})
})

// update and save image
router.patch('/save/:imageId', function(req, res) {
	console.log('request: update image')
	let response = {}
	image.updateStoreImageById(req.params.imageId, req.body, function(err, doc){
		if (err) {
			console.log('failed to update new image')
			response = {error: 'failed to update new image'}
		} else {
			response = {data: doc, msg: 'image updated'}
		}
		res.send(response)
	})
})


// delete profile picture
router.delete('/:imageId', function(req, res) {
	console.log('request: delete image')
	let response = {}
	image.deleteImageById(req.params.imageId, function(err) {
		if (err) {
			console.log('failed to delete image')
			response = {error: 'failed to delete image'}
		} else {
			response = {msg: 'image deleted'}
		}
		res.send(response)
	})
})

module.exports = router;
