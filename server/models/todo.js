const mongoose = require('mongoose');


var Todo = mongoose.model('Todo',{
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completedAt: {
        type: Boolean,
        default: null
    },
    completed: {
        type: Number,
        default: 123
    }
});

module.exports = {Todo};