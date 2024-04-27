// Import express.js
const express = require("express");
const { User } = require("./models/user");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const session = require('express-session');
// Create express app
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("static"));

// pug engine
app.set('view engine', 'pug');
app.set('views', './app/views');



//sessions and cookies
app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
const sessionMiddleware = session({
    secret: "secretkeysdfjsflyoifasd",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
});
app.use(sessionMiddleware);

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

// Create a route for testing the db
app.get("/mypreferences", function(req, res) {
    login_id = 1
    const sql = `SELECT * FROM preferences where user_id = ${login_id} order by created_date ASC`;
    db.query(sql).then(results => {
        console.log(results);
        res.render('mypreferences', { results: results });
    });
});

// Trainer home page
app.get("/trainer-home", function(req, res) {
    const sql = 'SELECT * FROM preferences order by created_date ASC';
    db.query(sql).then(results => {
        console.log(results);
        res.render('trainer-home', { results: results });
    });
});


app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-student page
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.send('Password set successfully');
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            res.send('Perhaps a page where a new user sets a programme would be good here');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Email and password are required.');
        }

        var user = new User(email);
        const uId = await user.getIdFromEmail();
        if (!uId) {
            return res.status(401).send('Invalid email');
        }

        const match = await user.authenticate(password);
        if (!match) {
            return res.status(401).send('Invalid password');
        }

        req.session.uid = uId;
        req.session.loggedIn = true;
        console.log(req.session.id);
        res.redirect('/single-student/' + uId);
    } catch (err) {
        console.error(`Error while authenticating user:`, err.message);
        res.status(500).send('Internal Server Error');
    }
});



app.get("/", function (req, res) {
    try {
        if (req.session.uid) {
            res.send('Welcome back, ' + req.session.uid + '!');
        } else {
            res.render('login_signup');
        }
        res.end();
    } catch (err) {
        console.error("Error accessing root route:", err);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/logout', function (req, res) {
    try {
        req.session.destroy();
        res.redirect('/login');
    } catch (err) {
        console.error("Error logging out:", err);
        res.status(500).send('Internal Server Error');
    }
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});