const mongo = require("mongoose");
const Schema = mongo.Schema;

//constructor(userId, password, firstName, lastName, biography, contact, location, securityQA, pets
const user = new Schema({
    username: {
        type:String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    firstName:{
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: true
    },
    biography:{
        type: String
    },
    contact: {
        type: {email: "string", cell:"string", whatsapp: "string", facebook: "string"},
        // required: true
    },
    location: {
        type: {country: "string", province: "string", city: "string"},
        // required: true
    },
    securityQA: {
        type: { question: 'string', answer: "string" },
        // required: true
    },

    pets:{
        type: [Schema.Types.ObjectId],
        // required: true
    }
});

//add new user
user.statics.addNewUser = function(user, callback){
    try{
        const location = {city: user.city, province:user.province, country:user.country};
        const contact = {email: user.email, cell:user.phone, whatsapp: user.whatsapp, facebook: user.facebook};
        const securityQA = {question:user.question, answer:user.answer};
        const newUser = new this({username: user.username, password: user.password, firstName: user.firstName, lastName: user.lastName,
                    biography: user.biography, contact: contact, location: location, securityQA: securityQA,
                    pets: user.pets});
        newUser.save(function (err) {
            if(err)
                callback(err);
            else
                callback(null, newUser);
        });
    } catch (e) {
        callback(e);
    }
};

//delete existing user by userId
user.statics.deleteUserByUsername = function(username, callback){
    // Returns:	A document containing:
    // A boolean acknowledged as true if the operation ran with write concern or false if write
    // concern was disabled, deletedCount containing the number of deleted documents
    try {
        this.deleteOne({ username : username}, function (err, doc) {
            if(err)
                callback(err);
            else
                callback(null, doc);
        });

    } catch (e) {
        callback(e);
        console.log("failed to delete user");
    }
};

//get all users
user.statics.getUsers = function(callback){
    return this.find({}, callback);
};

//find user by objectId from user collection
user.statics.findUserByUsername = function (userName, callback) {
    return this.findOne({ username: userName }, callback);
};

//update user personal info given a user object
user.statics.updateUserInfo = function (username, user, callback) {
    let location = {city: user.city, province:user.province, country:user.country};
    let contact = {email: user.email, cell:user.phone, whatsapp: user.whatsapp, facebook: user.facebook};
    let securityQA = {question:user.question, answer:user.answer};

    return this.findOneAndUpdate({
        username: username
    }, {
        // update operators: $set and $inc
        $set: {
            firstName: user.firstName,
            lastName: user.lastName,
            biography: user.biography,
            contact: contact,
            location: location,
            securityQA: securityQA
        }
    }, {
        returnOriginal: false // gives us back updated arguemnt
    }, callback)
};

//update user password
user.statics.updatePassword = function (username, passwords, callback) {
    const self = this;
    this.findOne({username: username}, {password: 1}, function (err, doc) {
        if(err || !doc)
            return callback("user does not exist");
        if(doc.password===passwords.oldPwd){
            return self.findOneAndUpdate({username:username}, {$set:{password: passwords.newPwd}},
                {new: true}, function (err, doc) {
                    if(err)
                        return callback(err);
                    return callback(null, doc);
                });
        }  else {
            callback("Invalid current password");
        }
    });
};

//user add pet
user.statics.addPet = function (username, petId, callback) {
    this.findOneAndUpdate({username:username}, {$push:{pets: petId}},
        {new: true}, function (err, doc) {
            if(err)
                return callback(err);
            return callback(null, doc);
        });
};

//user delete pet
user.statics.deletePet = function (username, petId, callback) {
    return this.findOneAndUpdate({username:username}, {$pull:{pets: petId}},
        {new: true}, function (err, doc) {
            if(err)
                return callback(err);
            return callback(null, doc);
        });
};

module.exports = mongo.model("user", user);
