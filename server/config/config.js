var current_env = process.env.NODE_ENV || 'developmnet';

const _port = 3000;

if(current_env === 'developmnet'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoMongoose';
}
else if(current_env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoMongooseTest';
}