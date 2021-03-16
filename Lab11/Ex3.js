attributes = "Jacob;20;MIS"
parts = attributes.split(";"); // Split
var pieces = [];
for(var i = 0; i < arguments.length; i++) {
    pieces.push(arguments[i]);
}
var merge = pieces.join(','); // Invert back to string
console.log(parts);
console.log("Inverted back into a string.")