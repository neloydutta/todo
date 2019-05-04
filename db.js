const mongoose = require('mongoose');
var Schema = mongoose.Schema;
models = {
    todomodel : mongoose.model('todomodel', new Schema({
        _id: String,
        todos: []
    }))
}
module.exports = models;