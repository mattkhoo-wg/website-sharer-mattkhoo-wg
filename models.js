import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongoDB..")
await mongoose.connect('mongodb+srv://mkhoo98:1235@classcluster.ozt4beh.mongodb.net/?retryWrites=true&w=majority')
console.log('Successfully connected to mondoDB!')

const postSchema = new mongoose.Schema({
    username: String,
    url: String,
    description: String,
    created_date: Date
})

models.Post = mongoose.model('Post', postSchema)

export default models