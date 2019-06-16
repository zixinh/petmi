const express = require('express');
const router = express.Router();
const User = require("../models/user"); //import user model
const fs = require("fs");

//get /user/ to get specific user
router.get('/', function (req, res) {
    let response = {};
    //if find user by id or get current user
    if(req.query.username || req.session.username){
        const username = req.query.username?req.query.username:req.session.username;
        console.log("find user called");
        User.findUserByUsername(username, function (err, doc) {
            if (err){
                console.log("failed to get user", err);
                response = {error: "failed to get user"}
            } else{
                response = {data: doc, msg: "user found"};
            }
            res.send(response);
        })
    } else{
        response = {error: "failed to get user"};
        res.send(response);
    }
});

router.get('/users', function (req, res) {
    //get all users
    let response = {};
    console.log("getting all users");
    User.getUsers(function (err, users) {
        if(err){
            response = {error: "failed to get users"}
            console.log(err);
        }else{
            response = {data: users, msg: "users found"};
        }
        res.send(response);
    });
});

//post /user/add for add user
router.post('/add', function (req, res) {
    // console.log("add user received", req.body);
    User.addNewUser(req.body, function (err, doc) {
        let response = {};
        if (err || !doc){
            console.log("failed to add user", err);
            response = {error: "failed to add user"}
        } else{
            //console.log(doc);
            response = {data: doc, msg: "added new user"};
            let options = {
                maxAge: 1000 * 60 * 15, // would expire after 15 minutes
                httpOnly: false, // The cookie only accessible by the web server
                signed: false // Indicates if the cookie should be signed
            };
            // Set cookie
            req.session.username = doc.username;
            // res.cookie('username', doc.username, options);
        }
        res.send(response);
    })
});

//post /user/verify for user login
router.post('/verify', function (req, res) {
    User.findUserByUsername(req.body.username, function (err, doc) {
        let response = {};
        if (err){
            console.log("failed to get user", err);
            response = {error: "user does not exist"}
        } else if (!doc){
            //check if admin is logging in
            const settings =  JSON.parse(fs.readFileSync(appRoot + '/data/settings.json'));
            if(req.body.username===settings.admin && req.body.password===settings.key){
                response = {admin: true};
            } else {
                response = {error: "user does not exist"}
            }
        } else{
            let inputPwd = req.body.password;
            // console.log("user found", doc);
            if(doc.password === inputPwd){
                response = {data: doc, msg:"user verified"};
                console.log("user verified");
                let options = {
                    maxAge: 1000 * 60 * 15,
                    httpOnly: false,
                    signed: false
                };
                // res.cookie('username', doc.username, options)
                req.session.username = doc.username;
            }
            else
                response = {error: "invalid password"}
        }
        // res.send("user verified");
        return res.send(response);
    })
});

//patch /user/password for change user password
router.patch('/password', function (req, res) {
    console.log("change password user received");
    let response = {};
    User.updatePassword(req.query.username, req.body, function (err, doc) {
        if(err){
            response = {error: err}
        } else{
            response = {data: doc, msg: "password updated"};
        }
        res.send(response);
    });
});

//patch /user for user info update by admin/user
router.patch("/", function (req, res) {
    console.log("update user received");
    let response = {};
    User.updateUserInfo(req.query.username, req.body, function (err, doc) {
        if(err){
            console.log("failed to update user info", err);
            response = {error: "failed to update user info"};
        } else {
            response = {data: doc, msg: "user info updated"};
        }
        res.send(response);
    });
});

//patch /user/add for adding new pet id to user.pets
router.patch("/add", function (req, res) {
    console.log("update user pets received");
    let response = {};
    User.addPet(req.query.username, req.query.petId, function (err, doc) {
        if(err){
            console.log("failed to update user pets", err);
            response = {error: "failed to add new pet to user"};
        } else {
            response = {data: doc, msg: "user pet added"};
        }
        res.send(response);
    });
});

//delete /user for deleting user by admin
router.delete("/", function (req, res) {
    console.log("delete user received");
    let response = {};
    User.deleteUserByUsername(req.query.username, function (err, doc) {
        if(err){
            console.log("failed to delete user", err);
            response = {error: "failed to delete user"};
        } else{
            response = {data: doc, msg: "user deleted"};
        }
        res.send(response);
    });

});

module.exports = router;
