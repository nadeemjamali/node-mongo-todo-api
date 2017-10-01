const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');


var message = "I am user number 3";

var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);


var token = {id: 10};

var t = jwt.sign(JSON.stringify(token), 'verysecret');
console.log(`JWT token: ${t}`);

var v = jwt.verify(t, 'verysecret');
console.log(`JWT verified: ${JSON.stringify(v)}`);