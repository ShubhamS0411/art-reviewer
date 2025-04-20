import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    file: {type: String, required: true},
    user: {type: String, required: true},
    description: {type: String, required: true},
    category: {type: String, required: true},
    review: [
        {
            username: { type: String, required: true },
            review: { type: String, required: true },
            account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true}
        }
    ],
    account: {type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true},
},{timestamps: true});

const commentModel = mongoose.model('Comment', commentSchema);
export default commentModel;