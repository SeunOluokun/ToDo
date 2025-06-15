const mongoose = require('mongoose');
//const {Schema} =  mongoose;
const Schema = mongoose.Schema

const TaskModelSchema = new Schema({
task:{type: String},
status:{type: String, required: true},
priority:{type: String, required: true},//priority can be low, medium, high
userId: {
type: Schema.Types.ObjectId,
ref: 'users',
required: true
},
createdAt:{type: Date, default: Date.now},
updatedAt:{type: Date, default: Date.now}
}, {
    timestamps: true // This will automatically add createdAt and updatedAt fields
})
//To use our schema definition, we need to convert our Task new Schema into a 
// Model we can work with To do so, we pass it into mongoose.model(modelName, schema):
const Task = mongoose.model('tasks', TaskModelSchema);//save in task collection using constructor of schema

module.exports = Task;