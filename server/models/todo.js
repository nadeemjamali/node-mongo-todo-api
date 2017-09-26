const mongoose = require('mongoose');


var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completedAt: {
        type: Number,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    }
});

module.exports = {Todo};