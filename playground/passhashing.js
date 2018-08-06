const bcrypt = require('bcryptjs');

let password = '123abc!';

let salt = bcrypt.genSalt(10, (err, salt)=>{
    bcrypt.hash(password, salt, (err, hash) =>{
        console.log('Let salt', hash);
    });
});

var getHash = (password) => {
     return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                resolve(hash);
            });
        })
    });
};

var isPaswordGenuine = (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, (err, result) => {
            if(err)
                reject(err);
            resolve(result);    
        });
    });
};

getHash(password)
    .then((calculatedHash) => {
        console.log(`Hash value for ${password} = ${calculatedHash}`);
        return isPaswordGenuine('123abc!', calculatedHash);
    })
    .then((isGenuine) => {
        console.log(`Is password genuine? ${isGenuine}`);
    })
    .catch((error) => {
        console.log('Error while computing hashing or compharison', error);
    });

isPaswordGenuine('abc123', 'abc123').then((result) =>{
    console.log(`Two identical passwords match ? ${result}`);
});
