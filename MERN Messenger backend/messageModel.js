import mongoose from 'mongoose'

const messageSchema= mongoose.Schema({
    username: String,
    message: String,
    timestamp: String
})

//messages is the collection
export default mongoose.model('messages', messageSchema)