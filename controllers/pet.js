const express = require('express');
const router = express.Router();
const Pet = require("../models/pet");

/* Retrieve all pets. */
router.get('/all', function (req, res) {
    console.log("GET all pets received.");
    let response;
    Pet.findAllPets(function (err, doc) {
        if (err) {
            console.log("Failed to get all pets.", err);
            response = {
                error: "Failed to get all pets."
            }
        } else {
            response = {
                data: doc,
                msg: "All pets found."
            };
        }
        res.send(response);
    })
})

/* Retrieve a specific pet given a petId. */
router.get('/:petId', function (req, res) {
    let response = {};
    /* petId was given so find that one pet. */
    console.log("GET a pet received.");
    Pet.findPetById(req.params.petId, function (err, doc) {
        console.log("GET pet: " + req.params.petId);
        if (err) {
            console.log("Failed to get pet.", err);
            response = {
                error: "Failed to get pet."
            }
        } else {
            response = {
                data: doc,
                msg: "Pet found."
            };
        }
        res.send(response);
    })
});

/* Retrieve all the pets for a specific userId. */
router.get('/owner/:ownerUsername', function (req, res) {
    let response = {};
    /* petId was given so find that one pet. */
    console.log("GET pets for an owner received.");
    Pet.findPetsByUsername(req.params.ownerUsername, function (err, doc) {
        if (err) {
            console.log("Failed to get pet(s).", err);
            response = {
                error: "Failed to get pet(s)."
            }
        } else {
            response = {
                data: doc,
                msg: "Pet(s) found."
            };
        }
        res.send(response);
    })
});

/* POST @ /pet/add adds a new pet. */
router.post('/add', function (req, res) {
    console.log("add pet received");
    Pet.addNewPet(req.body, function (err, doc) {
        let response = {};
        if (err) {
            console.log("failed to add pet", err);
            response = {
                error: "failed to add pet"
            }
        } else {
            response = {
                data: doc,
                msg: "added new pet"
            };
        }
        res.send(response);
    })
});

/* PATCH @ /pet/?petId for updating a pet's information by the admin or a user. */
router.patch("/:petId", function (req, res) {
    console.log("update pet received");
    let response = {};
    Pet.updatePetInfo(req.params.petId, req.body, function (err, doc) {
        if (err) {
            console.log("failed to update pet info", err);
            response = {
                error: "failed to update pet info"
            };
        } else {
            response = {
                data: doc,
                msg: "pet info updated"
            };
        }
        res.send(response);
    });
});

/* PATCH @ /pet/match?petId for updating a pet's matches info by the admin or a user. */
router.patch("/match/:petId", function (req, res) {
    console.log("update pet received");
    let response = {};
    Pet.updatePetMatches(req.params.petId, req.body, function (err, doc) {
        if (err) {
            console.log("failed to update pet info", err);
            response = {
                error: "failed to update pet info"
            };
        } else {
            response = {
                data: doc,
                msg: "pet info updated"
            };
        }
        res.send(response);
    });
});

/* DELETE @ /pet/?petId for deleting a pet by the admin or a user. */
router.delete("/:petId", function (req, res) {
    let response = {};
    Pet.deletePetById(req.params.petId, function (err) {
        if (err) {
            response = {
                error: "failed to delete pet"
            };
        } else {
            console.log("okay");
            response = {
                msg: "pet deleted"
            };
        }
        res.send(response);
    });
});

module.exports = router;