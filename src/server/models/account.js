
import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
    account_type: {type: String, required: true},
    username: {type: String, required: true, index: true, unique: true},
    password: {type: String, required: true},
    email: {type: String, required: true, unique: true, index: true},  
    refreshToken: {type: [], required: false}, 
},{timestamps: true});

const accountModel = mongoose.model('Account', accountSchema);
export default accountModel;