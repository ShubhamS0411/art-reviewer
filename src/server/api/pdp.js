import commentModel from "../models/post.js";
import accountModel from "../models/account.js";

export default async function PDP(req,res) {
    try{
    const {id} = req.params;
    const idExsists = await commentModel.findOne({ _id: id });
    const accountExsists = await accountModel.findOne({ username: idExsists.user });
    if(!idExsists){
        return res.status(400).json({message: "Cannot Find Post Of Requested User"});
    }
    
    res.status(200).json({message: "Post Found Successfully", idExsists, accountExsists});
}
catch(err){
    console.error(err);
    res.status(500).json({message: "Internal Server Error"})
}
    
}