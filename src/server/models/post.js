import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    file: {type: String, required: false},
    user: {type: String, required: true},
    review: [
        {
            username: { type: String, required: true },
            review: { type: String, required: true }
        }
    ]
},{timestamps: true});

const commentModel = mongoose.model('Comment', commentSchema);
export default commentModel;