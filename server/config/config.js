var env = process.env.NODE_ENV || 'development';
console.log('env*******', env);

if(env === 'development'){

	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test'){

	process.env.MONGOBD_URI = 'mongodb://localhost:27017/TodoAppTest'
} else if (env === 'production'){

    process.env.MONGOBD_URI = 'mongodb://stef:stef1234@ds263571.mlab.com:63571/todoapp';
}