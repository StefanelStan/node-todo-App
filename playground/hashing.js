const {SHA256}  =require('crypto-js');


var verifyHash = (tokenHash, serverHash) => {
    if (token.hash === resultHash) {
        console.log('Data was not changed');
    } else {
        console.log('Data was changed!');
        console.log(token.hash);
        console.log(resultHash);
    }
}

let message = 'I am user number 3';
let hash = SHA256(message).toString();
console.log(`Hash value for message[${message}] is [${hash}]`);

let data = {
    id: 4
};

let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

verifyHash(token.hash, resultHash);

//let's say someone is trying to be cheeky and change his ID and his hash
token.data.id = 5;
token.hash = SHA256(JSON.stringify(token.data)).toString();
verifyHash(token.hash, resultHash);
