const express = require('express');
const session = require('express-session');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser'); // middleware for parsing HTTP body from cli
const mongoose = require('mongoose');
const fs = require("fs");
const userRouter = require("./controllers/user");
const petRouter = require("./controllers/pet");
const imageRouter = require("./controllers/image");

const app = express();


const settings = JSON.parse(fs.readFileSync(__dirname + '/data/settings.json'));
const breeds = JSON.parse(fs.readFileSync(__dirname + '/data/species_breeds.json'));

// connect to our database
mongoose.connect('mongodb+srv://dev:dev123@cluster0-9lhh0.mongodb.net/' + settings.database + '?retryWrites=true', { useNewUrlParser: true}).then(()=>{
    console.log("db connected");

    app.use(express.static(__dirname + '/html'));
    app.use(express.static(__dirname + '/css'));
    app.use(express.static(__dirname + '/js'));
    app.use("/images", express.static(__dirname + '/images'));

    // Add express sesssion middleware
    app.use(session({
        secret: 'csc309',
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 600000,
        },
        store: new(require('express-sessions'))({
            storage: 'mongodb',
            instance: mongoose,
            host: "mongodb+srv://dev:password123@cluster0-9lhh0.mongodb.net/",
            db: settings.database,
            collection: 'sessions',
        })
    }));

    // body-parser middleware setup.  Will parse the JSON and convert to object
    //!!!!! must be placed before any routers
    app.use(bodyParser.json({limit: '10mb'}));
    app.use(bodyParser.urlencoded({limit: '10mb'}));

    app.get('/', (req, res) => {
        if (req.session.user) {
            console.log("user verified");
            res.redirect('HomeView.html')
        } else {
            res.redirect('LandingPageView.html');
        }
    });

    app.get('/logout', function (req, res) {
        console.log("logout received");
        req.session.destroy((error) => {
            if (error) {
                res.status(500).send(error)
            } else {
                res.redirect('LandingPageView.html');
            }
        })
    });

    app.get('/breeds', function (req, res) {
        res.send(breeds);
    });

    //use userRouter if url starts with /user
    app.use('/user', userRouter);

    // use petRouter if URL starts with /pet
    app.use('/pet', petRouter);

    // use imageRouter if url starts with /image
    app.use('/image', imageRouter);

    //printing out request urls for debugging
    //app.use(logger());
    global.appRoot = __dirname;

}).then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}...`)
    });
}).catch((err) => {
    console.log('error encountered: ', err);
    process.exit(1);
});