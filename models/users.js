const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
    username: String,
    password: String
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
});

// Adding passport-local-mongoose plugin to the schema
UserModelSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserModelSchema); // Save in users collection using constructor of UserModelSchema schema
// The model name 'User' will be used to create a collection named 'users' in MongoDB
// The passport-local-mongoose plugin will add methods for authentication like register, authenticate, etc.