const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

//Paspport Config
require('./config/passport')(passport);

// DB CONFIG

const db = require('./config/keys').MongoURI;

//CONNECT TO MONGO

mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('mongoDB connected..'))
    .catch(err => console.log(err))

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session Middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
  }))

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect Flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//ROUTES
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log('Server started on port 3000..'));