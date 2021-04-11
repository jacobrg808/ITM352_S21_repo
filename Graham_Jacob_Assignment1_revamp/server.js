// Setup server

var express = require('express');
var app = express();
var myParser = require("body-parser")
app.use(myParser.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + 'with query' + JSON.stringify(request.query));
    next();
});

app.post('./public/products_display.html', function (request, response, next) {
    post_data = request.body;
    response.send(post_data);
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`));