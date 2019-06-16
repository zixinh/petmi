const mongo = require("mongoose");
const Schema = mongo.Schema;
const fs = require('fs');

const image = new Schema({
    path: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
});

// add image
image.statics.addNewImage = function(image, callback) {
    try {
        let newImage = this.create({
            path: image.path, 
            description: image.description
        }, (err) => {
            if (err) {
                callback(err);
                console.log("Failed to create new image.");
            } else {
                callback(null, newImage);
            }
        })
    } catch (e) {
        callback(e)
        console.log("Failed to create new image.");
    }
}

// add and store image
image.statics.addStoreNewImage = function(image, callback) {
    try {
        let newImage = this.create({
            path: image.path,
            description: image.description
        }, (err) => {
            if (err) {
                callback(err)
                console.log('failed to create new image')
            } else {
                // write to server folder
                fs.writeFile(image.path, image.formData, function (err) {
                    if (err) {
                        callback(err)
                        console.log('failed to store image');
                    }
                    console.log("The file was saved!");
                });
                callback(null, newImage)
            }
        })
    } catch (e) {
        callback(e)
        console.log("failed to create and store new image")
    }
}

//find image by imageId
image.statics.findImageById = function(imageId, callback) {
    return this.findOne({
        "_id": new mongo.Types.ObjectId(imageId)
    }, null, null, callback)
}

//find all images
image.statics.findAllImages = function(callback){
    this.find({}, function (err, images) {
        if (err) {
            callback(err)
        } else {
            let allImages = []
            images.forEach(function (img) {
                allImages.push(img)
            })
            callback(null, allImages)
        }
    })
}

//update image by userId
image.statics.updateImageById = function(imageId, image, callback) {
    return  this.findOneAndUpdate({
        "_id": new mongo.Types.ObjectId(imageId)
    }, {
        $set : {
            path: image.path,
            description: image.description
        }
    }, {
        returnOriginal: false // gives us back updated arguemnt
    }, callback)
} 

// update and save image
image.statics.updateStoreImageById = function(imageId, image, callback) {
    fs.writeFile(image.path, image.formData, function (err) {
        if (err) {
            callback(err)
            console.log('failed to store image');
        }
        console.log("The file was saved!");
    });

    return this.findOneAndUpdate({
        "_id": new mongo.Types.ObjectId(imageId)
    }, {
        $set : {
            path: image.path,
            description: image.description
        }
    }, {
        returnOriginal: false // gives us back updated arguemnt
    }, callback)
} 


//delete image by imageId
image.statics.deleteImageById = function(imageId, callback) {
    this.findOne({
        "_id": new mongo.Types.ObjectId(imageId)
    }).deleteOne(function (err) {
        if (err) {
            callback(err)
        } else {
            callback(null)
        }
    })
};


module.exports = mongo.model("image", image);
