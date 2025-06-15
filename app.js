const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const {connectToDatabase} = require ('./mongoDbConnect')
const TaskDBModel = require('./models/toDoModel')
//authentication and authentication related imports
const passport = require('passport');
const session = require('express-session');
const connectEnsureLogin = require('connect-ensure-login');
const userDBModel= require('./models/users');
//EJS Template method override
const methodOverride = require('method-override');
//User X Pop up messages
const flash = require('connect-flash');


const app = express();
const PORT = process.env.PORT;
const taskRoute = require('./routes/taskRoute');
const bodyParser = require('body-parser');
//const TaskRouter = express.Router() at path ./routes/taskRoute
app.use(express.json())//express inbuilt body parser middleware
app.use(methodOverride('_method'));//method override middleware to support PUT and DELETE methods in forms

//connect to mongoDb Instance
connectToDatabase();

//Initializing passport
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } //1 hour
}));//session middleware to manage user sessions by storing session data on the server side
app.use(bodyParser.urlencoded({ extended: true })); //body parser middleware to parse url encoded data from the request body
app.use(passport.initialize());//initialize passport middleware
app.use(passport.session());//session middleware to manage user sessions by serializing and deserializing user sessions data
app.use(flash());//flash middleware to store flash messages in the session

passport.use(userDBModel.createStrategy());//passport-local-mongoose strategy for user authentication

passport.serializeUser(userDBModel.serializeUser());//serialize user session data
passport.deserializeUser(userDBModel.deserializeUser());//deserialize user session data

app.set('view engine', 'ejs')
app.set('views', 'views');//setting view property to views folder/directory

app.use('/tasks',connectEnsureLogin.ensureLoggedIn(), taskRoute );

app.get('/', (request, response)=>{
    response.render('home')
})

app.get('/login', (request, response)=>{
    response.render('login')
})
app.get('/signup', (request, response)=>{
    response.render('signup', { error: null })
})
app.post('/signup', (request, response) => {
    const user = request.body;
    userDBModel.register(new userDBModel({ username: user.username }), user.password, (error, user) => {
        if (error) {
            console.error('Error registering user:', error);
            return response.render('signup', { error: error.message || 'Error registering user. Please try again.' });
        }
        passport.authenticate('local')(request, response, () => {
            response.redirect('/tasks');
        });
    });
});

app.post('/login', (request, response, next) => {
    passport.authenticate('local', (error, user, info) => {
        if (error) {return response.render('login', { error: error.message || 'Error logging in user. Please try again.' });
        }
        if (!user) {return response.render('login', { error: info && info.message ? info.message : 'Invalid credentials' });
        }
        request.logIn(user, (error) => {
            if (error) {return next(error);
            }
            response.redirect('/tasks');
        });
    })(request, response, next);
});

//Logout route
app.get('/logout', (request, response)=>{
    request.logout((error)=>{
        if(error){
            console.error('Error logging out:', error);
            return response.redirect('/tasks');
        }
        response.redirect('/');
    });
})

//Error handling middleware
app.use((error, request, response, next)=>{
    console.error('Error:', error);
    response.status(500).send({
        message: 'Internal Server Error',
        error: error.message
    });
})

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})