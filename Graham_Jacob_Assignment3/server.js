// "Jacob's Pokémon Card Shop" Assignment3 website by Jacob Graham 2021
// Programming based off of examples given by DAN PORT in Lab13, Lab14 and in class, along with help from w3schools and NOAH KIM

// Setup server
// Load product data
var data = require('./public/products_data.js')
var productsList = data.productsList;

// Load certain node modules
var fs  = require('fs') // setup qs
const queryString = require('query-string'); // setup queryString
const nodemailer = require('nodemailer'); // setup email module, documentation: https://nodemailer.com/about/
var myParser = require('body-parser') // setup body-parser

// Cookies and sessions
var cookieParser = require('cookie-parser'); // setup cookie-parser
var session = require('express-session'); // setup express sessions

// Setup app
var express = require('express'); // require express
var app = express(); // set the varaible app equal to express

// Use myParser and cookieParser
app.use(myParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Setup app.all
app.all('*', function (req, res, next) {
    console.log(req.method + ' to ' + req.path);
    next();
});

// Setup variables related to the user
var user_data_file = './user_data.json'; // Set userData equal to user_data.json
if(fs.existsSync(user_data_file)) {
    var users_reg_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
}
else {
    console.log(`${user_data_file} does not exist!`)
}

// Derived from Lab 14 and Assigment2 screencast by DAN PORT, further modifed for Assignment3
// Take form and process it given that the information submitted is ok
app.post("/process_form", function (req, res) {
    let POST = req.body;
    // Given that POST is not undefined begin setup of variables and statements
    if (typeof POST['addProducts${i}'] != 'undefined') {
        var legitAmount = true;
        var hasAmount = false;
        //
        for (i = 0; i < `${(products_array[`type`][i])}`.length; i++) { 
            qty = POST[`quantity_textbox${i}`]; 
            if (qty > 0) {
                hasAmount = true; 
            }
            if (isNonNegInt(qty) == false) {
                legitAmount = false;
            }
        }

        const stringified = queryString.stringify(POST); // convert data to string

        // Given that the value is legitimate and non-zero, move on
        if (legitAmount && hasAmount) {
            res.redirect("./login.html?" + stringified); // redirect to login
            return;
        }
        else { 
            res.redirect("./index.html?" + stringified) // redirect to homepage
        }
    }
});

// Thanks to NOAH KIM for giving guidance on the functions and statements
// Structure of process_login function from Lab14, modified for Assignment3
app.post('/process_login', function (req, res, next) {
    var errors = [];
    console.log(req.query);
    user_username = req.body.username.toLowerCase();
    // Check to see if info is defined
    if (typeof users_reg_data[user_username] != 'undefined') {
        // If info is good then redirect to invoice
        if (users_reg_data[user_username].password == req.body.password) {
            req.query.username = user_username;
            console.log(users_reg_data[req.query.username].name);
            req.query.name = users_reg_data[req.query.username].name;
            res.cookie('username', user_username)
            res.redirect('./index.html?' + queryString.stringify(req.query));
            return;
        }
        // Else push an error
        else {
            errors.push = ('Sorry, but the password you inputted is invalid!');  // Inform user that they inputted a wrong username
            console.log(errors);
            req.query.username = user_username;
            req.query.name = users_reg_data[user_username].name;
            req.query.errors = errors.join(';');
        }
    }
    // Else push an error
    else {
        errors.push = ('Sorry, but the username you inputted is invalid!'); // Inform user that they inputted a wrong username
        console.log(errors);
        req.query.username = user_username;
        req.query.errors = errors.join(';');
    }
    res.redirect('./login.html?' + queryString.stringify(req.query)); // Redirect to login page
});

// Thanks to NOAH KIM for giving guidance on the functions and statements
// Structure of process_register function from Lab14, modified for Assignment3
app.post("/process_register", function (req, res) {
    qstr = req.body
    console.log(qstr);
    var errors = [];

    // Username validation
    // Setup character limitations (Letters only for name)
    if (/^[a-zA-Z]+$/.test(req.body.name)) {
    }
    else {
        errors.push('Please follow the format for names! (ex. John Smith)')
    }
    // If the entered name is empty, return an error
    if (req.body.name == "") {
        errors.push('The full name inputted is invalid.');
    }
    // Set a maximum fullname length of 30
    if ((req.body.fullname.length > 30 && req.body.fullname.length < 0)){ // Output errors if the name is too long
        errors.push('Sorry! That name is too long.')
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
    
    // Email validation
    // Setup email limitations (from w3resource https://www.w3resource.com/javascript/form/email-validation.php)
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) {
    }
    else {
        errors.push('Please use a valid format email format (ex. johnsmith@gmail.com)')
    }

    // Make password a minimum of six characters
    if (req.body.password.length < 6) {
        errors.push('Your password is too short (Please use at least 6 characters).')
    }
    // Check to see if the passwords match
    if (req.body.password !== req.body.repeat_password) { 
        errors.push('Your password does not match.')
    }

    var registered_username = req.body["username"];
    var registered_name = req.body["name"]; 

    // Save new user information given no errors
    if (errors.length == 0) {
        POST = req.body;
        console.log('no errors');
        var registered_username = POST["username"];
        users_reg_data[registered_username] = {}; 
        users_reg_data[registered_username].name = req.body.name;
        users_reg_data[registered_username].password = req.body.password; 
        users_reg_data[registered_username].email = req.body.email; 
        fs.writeFileSync(user_data_file, JSON.stringify(users_reg_data, null, 2));
        res.cookie("username", registered_username); // Remember username
        res.cookie("name", registered_name); // Remember name
        res.cookie("email", req.body.email); // Remember email
        res.redirect('./index.html');
    } 
    // Check for errors
    else {
        console.log(errors)
        req.query.errors = errors.join(';');
        res.redirect('./register.html?' + queryString.stringify(req.query));
    }
});

// Process logout
app.get("/logout", function (req, res) {
    str = `<script>alert('Successfully logged out!'); location.href="./index.html";</script>`; // Setup string
    res.clearCookie('username'); // Clear cookie data related to username
    res.send(str); // Send string
    req.session.destroy(); // End session
    res.redirect('./index.html'); // Redirect user to home page
});

// Generate invoice, got inspiration from the Assignment3 examples, and information from https://stackoverflow.com/questions/4225030/jquery-save-json-data-object-in-cookie, and https://stackoverflow.com/questions/19737415/express-creating-cookie-with-json
app.post("/gen_invoice", function (req, res) {
    cart = JSON.parse(req.query['cartData']);
    cookie = JSON.parse(req.query['cookieData']);
    var email = users_reg_data[req.cookies.username].email;
    str = `
    <link href="./style/style_misc.css" rel="stylesheet">
    <h1>Purchase confirmed!</h1>

    <br><b>Thank you for shopping at Jacob's Pokémon Card Shop!</b></br>
    <br><b>An email has been sent to ${email}.</b></br>
    <br><b><a href="/logout">Clear cookies and sessions (Logout)</a></b></br>

    <table id="invoice" border="2">
      <tbody>

        <tr>
          <th style="text-align: center;" width="43%">Item</th>
          <th style="text-align: center;" width="11%">Quantity</th>
          <th style="text-align: center;" width="13%">Price</th>
          <th style="text-align: center;" width="54%">Extended Price</th>
        </tr>
        `;

    subtotal = 0; // Compute subtotal

    for (products in productsList) {
        for (i = 0; i < productsList[products].length; i++) { 
            quantities = cart[`${products}${i}`];
            if (quantities > 0) { // Setup conditionnals
                extended_price = quantities * productsList[products][i].price // Compute extended price
                subtotal += extended_price; // Add subtotal back to itself
                
                str +=` 
                    <tr>
                        <td width="43%">${productsList[products][i].brand}</td>
                        <td align="center" width="11%">${quantities}</td>
                        <td width="13%">$${productsList[products][i].price}</td>
                        <td width="54%">$${extended_price.toFixed(2)}</td>
                    </tr>
                `;
            }
        }
    }

    // Compute tax
    var tax_rate = 0.04712
    var tax_amount = tax_rate*subtotal;

    // Compute shipping
    if(subtotal <= 50) {
        shipping = 0;
    }

    else if(subtotal <=100) {
        shipping = 5;
    }

    else {
        shipping = 0.05*subtotal;
    }

    // Compute grand total
    var total = subtotal + tax_amount + shipping;

    str += `
            <tr>
                <td colspan="4" width="100%">&nbsp;</td>
            </tr>

            <tr>
            <td style="text-align: center;" colspan="3" width="67%">Subtotal</td>
            <td width="54%">$${subtotal.toFixed(2)}</td>
            </tr>
            
            <tr>
            <td style="text-align: center;" colspan="3" width="67%">Tax @ ${(tax_rate*100).toFixed(3)}%</span></td>
            <td width="54%">$${tax_amount.toFixed(2)}</td>
            </tr>

            <tr>
            <td style="text-align: center;" colspan="3" width="67%">Shipping</span></td>
            <td width="54%">$${shipping.toFixed(2)}</td>
            </tr>

            <tr>
            <td style="text-align: center;" colspan="3" width="67%"><strong>Total</strong></td>
            <td width="54%"><strong>$${total.toFixed(2)}</strong></td>
            </tr>

        </tbody>
    </table>`;

    // Create a "transporter" varaible for nodemailer
    var transporter = nodemailer.createTransport({ 
        host: 'mail.hawaii.edu',
        port: 25,
        secure: false,
        tls: {
            rejectUnauthorized: false
        }
    });

    // Setup mail template, derived from https://nodemailer.com/about/
    var mailTemplate = {
        from: 'jacobrg@hawaii.edu', // sender
        to: email, // receiver
        subject: 'Invoice', // subject heading
        html: str // html body set to str
    };

    // Send mail, derived from https://nodemailer.com/about/
    transporter.sendMail(mailTemplate, function (error, info) {
        if (error) {
            console.log(error); // report any errors to the console
        }
        else {
            console.log('Email sent: ' + info.res); // otherwise aknowldge that the email has been sent
        }
    });
    res.send(str); // display string in browser
});

// Setup the settings for a session, https://expressjs.com/en/resources/middleware/session.html used as a reference
app.use(session({
        secret: '7layg32t4d5yjqa6eq539jdadsfw0w2lmt', // encrypt session
        resave: true,
        saveUninitialized: false,
        httpOnly: false, 
        secure: true,
        ephemeral: true 
}))

app.use(express.static('./public')); // Use express.static

app.listen(8080, () => console.log(`
    listening on port 8080
    access here: http://itm-vm.shidler.hawaii.edu:8080/
`)); // Output to console the port we are listening in on