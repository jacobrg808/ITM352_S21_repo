// Programming based off of examples given by DAN PORT in Lab13 and Lab14 and with help from w3schools and NOAH KIM

// Setup server
var data = require('./public/products_data.js')
var products = data.products;
const queryString = require('query-string');
var myParser = require('body-parser')
var express = require('express');
var app = express();
var fs  = require('fs')

// Setup app.all
app.all('*', function (req, res, next) {
    console.log(req.method + ' to ' + req.path);
    next();
});

app.use(myParser.urlencoded({ extended: true }));

// set userData equal to user_data.json
var userData = './user_data.json'; 

// code from Lab14, modified for Assignment2
if(fs.existsSync(userData)) { 
    var file_stats = fs.statSync(userData);
    console.log(`${userData} has ${file_stats.size} characters.`);
    data = fs.readFileSync(userData, 'utf-8');
    users_reg_data = JSON.parse(data);
}
else {
    console.log(`${userData} does not exist!`)
}

// Thanks to NOAH KIM for giving guidance on the functions and statements
// structure of process_login function from Lab14, modified for Assignment2
app.post('/process_login', function (req, res) {
    var LogError = [];
    console.log(req.query);
    username = req.body.username.toLowerCase();
    // check to see if info is defined
    if (typeof users_reg_data[username] != 'undefined') {
        // if info is good then redirect to invoice
        if (users_reg_data[username].password == req.body.password) {
            req.query.username = username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name;
            res.redirect('./invoice.html?' + queryString.stringify(req.query));
            return;
        }
        // else push an error
        else {
            LogError.push = ('Sorry, but the password you inputted is invalid!');  // inform user that they inputted a wrong username
            console.log(LogError);
            req.query.username = username;
            req.query.name = users_reg_data[username].name;
            req.query.LogError = LogError.join(';');
        }
    }
    // else push an error
    else {
        LogError.push = ('Sorry, but the username you inputted is invalid!'); // inform user that they inputted a wrong username
        console.log(LogError);
        req.query.username = username;
        req.query.LogError = LogError.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query)); // redirect to login page
});

// Thanks to NOAH KIM for giving guidance on the functions and statements
// structure of process_register function from Lab14, modified for Assignment2
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];
    // Setup character limitations (Letters only for name)
    if (/^[A-Za-z]+$/.test(req.body.name)) {
    }
    else {
        errors.push('Please only use letters for your name!')
    }
    // If the entered name is empty, return an error
    if (req.body.name == "") {
        errors.push('The full name inputted is invalid.');
    }
    // Set a maximum fullname length of 30
    if ((req.body.fullname.length > 30 && req.body.fullname.length < 0)){ // Output errors if the password is too long
        errors.push('Sorry! That password is too long.')
    }
    // Check to see that the newly registered username is lower case
    var reguser = req.body.username.toLowerCase(); 
    if (typeof users_reg_data[reguser] != 'undefined') { // Output errors if name is taken
        errors.push('Sorry! That username is taken.') 
    }
    // Setup character limitations (Letters and numbers only for username)
    if (/^[0-9a-zA-Z]+$/.test(req.body.username)) {
    }
    else {
        errors.push('Please use only letters and numbers for your username.')
    }
  
    // Make password a minimum of six characters
    if (req.body.password.length < 6) {
        errors.push('Your password is too short (Please use at least 6 characters).')
    }
    // Check to see if the passwords match
    if (req.body.password !== req.body.repeat_password) { 
        errors.push('Your password does not match.')
    }

    // request fullname, username, and email
    req.query.fullname = req.body.fullname;
    req.query.username = req.body.username;
    req.query.email = req.body.email;

    // Rememeber user information given no errors
    if (errors.length == 0) {
        POST = req.body;
        console.log('no errors');
        var username = POST["username"];
        users_reg_data[username] = {};
        users_reg_data[username].name =  req.body.fullname;
        users_reg_data[username].password =  req.body.password;
        users_reg_data[username].email =  req.body.email;
        data = JSON.stringify(users_reg_data); // stringify user's info
        fs.writeFileSync(userData, data, "utf-8");
        res.redirect('./invoice.html?' + queryString.stringify(req.query));
    }
    // check for errors
    else {
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('register.html?' + queryString.stringify(req.query)); // redirect to register.html
    }
});

// Derived from Lab 14 and Assigment2 screencast
// take form and process it given that the information submitted is ok
app.post("/process_purchase", function (req, res) {
    let POST = req.body;
    console.log(POST)
    if (typeof POST['purchase_submit'] != 'undefined') {
        var hasValidQty = true; // assume that quantity is valid
        var hasQty = false;
        for (i = 0; i < products.length; i++) {
            quantity = POST[`quantity${i}`]; // set QtyCheck equal to POST[`quantity${i}`]
            if (quantity > 0) {
                hasQty = true // has non-zero quantity
            }
            if (isNonNegInt(quantity) == false) {
                hasValidQty = false // has both valid quantity and non-negative integer
            }
        }
        // given the the quantities inputted are valid, redirect the user back to index
        const stringified = queryString.stringify(POST); // If all quantities are valid then go to login.html with query string containing the order quantities
        if (hasValidQty && hasQty) {
            res.redirect("./login.html?" + stringified); // Directs user from products_display.html to login.html with the query string that has the order quantities
        } 
        else { 
            res.redirect("./index.html?" + stringified)
        }
    }
});

// isNonNegInt function from Lab11
// Check to see if the quantity inputted is valid
function isNonNegInt(q, return_errors = false) {
    var errors = []; // assume no errors at first
    if(q == '') q = 0; // if text box is blank, show nothing
    if (Number(q) != q) errors.push('<font color="red">Please input a number </font>'); // Check if string is a number value
    else {
        if (q < 0) errors.push('<font color="red">Please input a positive quantity </font>'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('<font color="red">Please input a whole number </font>'); // Check that it is an integer
    }
    return return_errors ? errors : (errors.length == 0);
}

app.use(express.static('./public')); // use express.static

app.listen(8080, () => console.log(`
    listening on port 8080
    access here: http://localhost:8080/
`)); // output to console the port we are listening in on