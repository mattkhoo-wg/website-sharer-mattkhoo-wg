import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongoDB..")
await mongoose.connect('mongodb+srv://mkhoo98:1235@classcluster.ozt4beh.mongodb.net/?retryWrites=true&w=majority')
console.log('Successfully connected to mondoDB!')

const postSchema = new mongoose.Schema({
    username: String,
    url: String,
    description: String,
    likes: [String],
    created_date: Date
})

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: mongoose.SchemaTypes.ObjectId,
    created_date: Date
})

const userSchema = new mongoose.Schema({
    username: String,
    favColor: String
})

models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema)
models.User = mongoose.model('User', userSchema)

export default models