var current_env = process.env.NODE_ENV || 'development';

if(current_env === 'test' || current_env === 'development'){
    var config = require('./config.json');
    var env = config[current_env];

    Object.keys(env).forEach((key) =>{
        process.env[key] = env[key];
    });
}
