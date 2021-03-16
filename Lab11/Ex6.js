function isNonNegInt(q, returnErrors=false) {
    errors = []; // Assume no errors at first
    if(Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    if(q < 0) errors.push('Negative value!'); // Check if it is non-negative
    if(parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
    return returnErrors ? errors : (errors.length == 0);
}

var piece;
attributes = "Jacob;20;MIS";
pieces = attributes.split(';');

for(i in pieces) {
    pieces[i] = `${typeof pieces[i]} ${pieces[i]}`;
}

console.log(pieces.join(', '));

function checkIt() {
    console.log(`${part} is non-negative integer ${isNonNegInt(part, true).join("***")}`);
}

pieces.forEach(
    function (item,i){console.log( (typeof item == 'string' && item.length > 0)? true : false)}
);