// Setup server
var express = require('express');
var app = express();
var myParser = require('body-parser')
app.use(myParser.urlencoded({ extended: true }));
var fs  = require('fs')
var cookieParser = require('cookie-parser');
app.use(cookieParser());
var session = require('express-session')

app.use(session({secret: "ITM rocks!"}));

// play with sessions
app.get('/set_session', function (req, res, next) {
    res.send(`Your session ID is ${req.session.id}`);
    next();
});

app.get('/use_session', function (req, res, next) {
    res.send(`Your session ID is ${req.session.id}`);
    req.session.destroy();
    next();
});

// play with cookies
app.get('/set_cookie', function (req, res, next) {
    // console.log(req.cookies);
    let my_name ='Jacob Graham';
    // res.clearCookie('my_name');
    now = new Date();
    res.cookie('my_name', my_name, {expire: 5000 + now.getTime()});
    res.send(`Cookie for ${my_name} sent`);
    next();
});

// play with cookies
app.get('/use_cookie', function (req, res, next) {
    // console.log(req.cookie);
    if(typeof req.cookies["username"] != 'undefined'){   
        let username = req.cookies["username"];
        res.cookie('username', username, {"maxAge": 10000})    
        res.send(`${user_data[username]["name"]} is logged in`);
    }
    else {
        res.send("You are not logged in!")
    }
    next();
});

// read user data file
var user_data_file = './user_data.json';
if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    // console.log(`${user_data_file} has ${["size"]}`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
}
else {
    console.log(`${user_data_file} does not exist!`)
}

app.all('*', function (req, res, next) {
    console.log(req);
    console.log(req.method + req.path);
    next();
});

app.post('/process_register', function(req, res) {
    // add a new user to the database
    username = req.body["uname"];
    user_data[username] = {};
    user_data[username]["password"] = req.body["psw"];
    user_data[username]["email"] = req.body["email"];
    user_data[username]["name"] = req.body["fullname"];

    // save updated user_data to file
    fs.writeFileSync(user_data_file, JSON.stringify(user_data));
    res.send(`${username} is registered!`);
});


console.log(user_data);

app.get("/login", function (req, res) {
    // Give a simple login form
    if(typeof req.cookie['username'] != 'undefined') {
        res.send(`${res.cookies['username']} is already logged in`);
        return;
    }
    if(typeof req.session['last_login'] != 'undefined') {
        last_login = 'Last login time was ' + req.session['last_login'];
    }
    else {
        last_login = "First time login";
    }
    str = `
        <body>
        Last login: ${last_login}
        <form action="process_login" method="POST">
        <input type="text" name="uname" size="40" placeholder="enter username" ><br />
        <input type="password" name="pword" size="40" placeholder="enter password"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    res.send(str);
});

// Process login form POST and redirect to logged in page if ok, back to login page if not
app.post('/process_login', function (request, response, next) {
    if(typeof request.session['last_login'] != undefined) {
        console.log("Last login time was" + request.session['last_login']);
    }
    else {
        console.log("first time login")
    }
    request.session['last_login'] = Date();

    let username_entered = request.body["uname"];
    let password_entered = request.body["pword"];
    if(typeof user_data[username_entered] != 'undefined') {
        if(user_data[username_entered]['password'] == password_entered) {
            response.cookie('username', username_entered, {"maxAge": 10000});    
            response.send(`${username_entered} is logged in.`);
        }
        else {
            response.send(`${username_entered} is wrong`);
        }
    }
    else {
        response.send(`${username} entered not found.`);
    }
});


app.use(express.static('./public')); // use express.static

var listener = app.listen(8080, () => console.log(`listening on port 8080 ${listener.address}`)); // output to console the port we are listening in on