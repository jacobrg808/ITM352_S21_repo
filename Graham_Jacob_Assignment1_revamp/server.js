// Setup server
var express = require('express');
var app = express();
var myParser = require('body-parser')
app.use(myParser.urlencoded({ extended: true }));
var qs = require('qs')
var fs  = require('fs')

// read user data
var user_data_file = './user_data.json';
if(fs.existsSync(user_data_file)) {
    var file_stats = fs.statSync(user_data_file);
    console.log(`${user_data_file} has ${["size"]}`);
    var user_data = JSON.parse(fs.readFileSync('./user_data.json', 'utf-8'));
}
else {
    console.log(`${user_data_file} does not exist!`)
}

console.log(user_data);

app.all('*', function (request, response, next) {
    console.log(request.method + request.path);
    next();
});

// function to process login
app.post('/process_login', function (request, response, next) {
    console.log(request.query)
    // check login and password match database

    // send to invoice
    request.query["purchased"] = "true";
    request.query["username"] = request.body["username"]
    response.redirect('products_display.html?' + qs.stringify(request.query));
});

app.use(express.static('./public')); // use express.static

app.listen(8080, () => console.log(`listening on port 8080`)); // output to console the port we are listening in on