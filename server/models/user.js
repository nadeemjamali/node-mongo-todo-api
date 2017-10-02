const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email!'
        }
    },
    password:{
        type:String,
        required: true,
        trim:true,
        minlength:6
    },
    tokens: [
        {
            access:{
                type: String,
                required: true
            },
            token: {
                type: String,
                required: true
            }
        }
    ]
});

//instance methods
UserSchema.methods.toJSON = function(){
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';

    var token = jwt.sign({ _id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};


//static/model/class methods
UserSchema.statics.findByToken = function(token){

    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, 'abc123');
    }catch(e){
        return Promise.reject();
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });

};


//mongose middlewares
UserSchema.pre('save',function(next){
    var user = this;
    

    if(user.isModified('password')){
        var password = user.password;
        bcrypt.genSalt(10, (err, salt)=>{
            if(!err){
                bcrypt.hash(password, salt,(error, hash) => {
                    if(!error){
                        user.password = hash;
                        console.log(`Password hashed: ${hash}`);
                    }else{
                        console.log(`error occurred while hashing: ${error}`);
                    }       
                    next();          
                });
            }else{
                next();
            }
        });
    }
    else{
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};