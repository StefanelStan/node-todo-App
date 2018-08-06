var env = process.env.NODE_ENV || 'development';
console.log('env*******', env);

if(env  === 'development' || env === 'test'){
	let config = require('./config.json');
	var envConfig = config[env];
	Object.keys(envConfig).forEach((key) =>{
		process.env[key] = envConfig[key];
	});
}

// if(env === 'development'){

// 	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test'){

// 	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoAppTest'
// } else 
if (env === 'production'){
    //set the env in heroku config command line
}