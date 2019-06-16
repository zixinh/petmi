const mongo = require("mongoose").set('debug', true);
const Schema = mongo.Schema;

const imageSchema = new Schema({
    src: {
        type: String,
        required: true
    },
    description: {
        type: String
    }
})

const pet = new Schema({
    ownerUsername: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    species: {
        type: String,
        enum: ['Dog', 'Cat'],
        required: true
    },
    breed: {
        type: String,
        required: true
    },
    profilePic: {
        type: imageSchema,
        default: {src: "/images/NA.png", description:"Profile photo no available"}
    },
    gallery: {
        type: [imageSchema]
    },
    biography: {
        type: String,
        required: true
    },
    relationshipGoal: {
        type: String,
        enum: ['Friendship', 'Mating'],
        required: true
    },
    matchedIds: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    favouriteIds: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    likes: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    likedBy: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    dislikes: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    dislikedBy: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    newMatches: {
        type: Number,
        default: 0
    }
});

/* Add a new pet.
 * POST @ /pet/ */
pet.statics.addNewPet = function (pet, callback) {
    try {
        if(pet.src && pet.description)
            pet.profilePic = {src: pet.src, description:pet.description};
        this.create({
            ownerUsername: pet.ownerUsername,
            name: pet.name,
            age: pet.age,
            gender: pet.gender,
            species: pet.species,
            breed: pet.breed,
            profilePic: pet.profilePic,
            gallery: pet.gallery,
            biography: pet.biography,
            relationshipGoal: pet.relationshipGoal,
        }, (err, doc) => {
            if (err) {
                callback(err);
                console.log("Failed to create new pet.");
            } else {
                callback(null, doc);
            }
        });
    } catch (e) {
        callback(e);
        console.log("Failed to create new pet.");
    }
};

/* Delete a pet by their petId.
 * DELETE @ /pet/petId */
pet.statics.deletePetById = function (petId, callback) {
    this.findOne({
        "_id": new mongo.Types.ObjectId(petId)
    }).deleteOne(function (err) {
        if (err) {
            callback(err);
        } else {
            callback(null);
        }
    });
};

/* Retrieve a pet by their petId.
 * GET @ /pet/?petId= */
pet.statics.findPetById = function (petId, callback) {
    return this.findOne({
        "_id": new mongo.Types.ObjectId(petId)
    }, null, null, callback);
};

/* Retrieve all pets.
 * GET @ /pet/ */
pet.statics.findAllPets = function (callback) {
    this.find({}, function (err, pets) {
        if (err) {
            callback(err)
        } else {
            let allPets = [];
            pets.forEach(function (pet) {
                allPets.push(pet);
            });
            callback(null, pets);
        }
    });
};

/* Retrieve all the pets for a given userId. */
pet.statics.findPetsByUsername = function (username, callback) {
    this.find({
        ownerUsername: username
    }, function (err, pets) {
        if (err) {
            callback(err)
        } else {
            let allPets = [];
            pets.forEach(function (pet) {
                allPets.push(pet);
            });
            callback(null, pets);
        }
    });
};

/* Update a pet's information including pet's matches, favourites, likes,
 * dislikes, and new matches.
 * PATCH @ /pet/petId given pet */
pet.statics.updatePetInfo = function (petId, pet, callback) {

    return this.findOneAndUpdate({
        "_id": new mongo.Types.ObjectId(petId)
    }, {
        $set: {
            name: pet.name,
            age: pet.age,
            gender: pet.gender,
            species: pet.species,
            breed: pet.breed,
            profilePic: pet.profilePic,
            gallery: pet.gallery,
            biography: pet.biography,
            relationshipGoal: pet.relationshipGoal,
        }
    }, {
        returnOriginal: false
    }, callback)
};

pet.statics.updatePetMatches = function (petId, pet, callback) {
    console.log("pet received in pet matches------", pet);

    return this.findOneAndUpdate({
        "_id": new mongo.Types.ObjectId(petId)
    }, {
        $set: {
            matchedIds: pet.matchedIds? pet.matchedIds:[],
            favouriteIds: pet.favouriteIds? pet.favouriteIds:[],
            likes: pet.likes? pet.likes: [],
            likedBy: pet.likedBy? pet.likedBy :[],
            dislikes: pet.dislikes? pet.dislikes:[],
            dislikedBy: pet.dislikedBy? pet.dislikedBy:[],
            newMatches: pet.newMatches? pet.newMatches:[]
        }
    }, {
        returnOriginal: false
    }, callback)
};
//
// pet.statics.changeIcon = function(image, petId){
//     await this.update({userId: userId}, {$set: {icon:newIcon}});
// };

module.exports = mongo.model("pet", pet);