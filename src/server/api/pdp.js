import commentModel from "../models/post.js";

export default async function PDP(req,res) {
    try{
    const {id} = req.params;
    const idExsists = await commentModel.findOne({ _id: id });
    if(!idExsists){
        return res.status(400).json({message: "Post does not exist"});
    }
    res.status(200).json({message: "Post Found Successfully", idExsists});
}
catch(err){
    console.error(err);
    res.status(500).json({message: "Internal Server Error"})
}
    
}