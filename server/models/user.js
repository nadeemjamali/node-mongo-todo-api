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

UserSchema.methods.generateAuthToken = async function(){
    var user = this;
    var access = 'auth';

    var token = jwt.sign({ _id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens.push({access, token});

    try{
        await user.save();
        return token;
    }
    catch(e){
        throw new Error('Could not save the token in database.');
    }
    // return user.save().then(() => {
    //     return token;
    // });
};

UserSchema.methods.removeToken = async function(token){
    var user = this;
    try{
        await user.update({
            $pull:{
                tokens:{token}
            }
        });
    }catch(e){
        throw new Error('Could not remove the token from the database.');        
    }

    // return user.update({
    //     $pull:{
    //         tokens:{token}
    //     }
    // });
};

//static/model/class methods
UserSchema.statics.findByToken = async function(token){

    var User = this;
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch(e){
        return Promise.reject();
    }

    try{
        return await User.findOne({
            '_id': decoded._id,
            'tokens.token': token,
            'tokens.access': 'auth'
        });
    }catch(e){
        throw new Error('Could not find the token in the database.');
    }
    
    // return User.findOne({
    //     '_id': decoded._id,
    //     'tokens.token': token,
    //     'tokens.access': 'auth'
    // });

};

UserSchema.statics.findByCredentials = async function(email, password){
    var User = this;
    try{
        const user = await User.findOne({email});
        if(!user){
            return Promise.reject();
        }

        return new Promise((resolve, reject)=>{
            bcrypt.compare(password, user.password, (err, res)=>{
                if(err){
                    return reject(err);
                }
                if(res){
                    resolve(user);
                }
                else{
                    return reject();
                }
                
            });
        });
    }catch(e){
        throw new Error('Username or password don\'t match!');
    }

    // return User.findOne({email}).then((user)=>{
    //     if(!user){
    //         return Promise.reject();
    //     }

    //     return new Promise((resolve, reject)=>{
    //         bcrypt.compare(password, user.password, (err, res)=>{
    //             if(err){
    //                 return reject(err);
    //             }
    //             if(res){
    //                 resolve(user);
    //             }
    //             else{
    //                 return reject();
    //             }
                
    //         });
    //     });
    // }).catch((e)=>{

    // });
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