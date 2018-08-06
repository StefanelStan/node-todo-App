const jwt = require('jsonwebtoken');

//jwt.sign();
//jwt.verify();

let data = {
    id: 10
};

let token = jwt.sign(data, '123abc')
console.log(token);

//let decoded = jwt.verify(token, '1' + '123abc');
let decoded = jwt.verify(token, '123abc');
console.log(decoded);