import postModel from "../models/post.js";
import jwt from "jsonwebtoken";

export default async function createReview (req,res){
    try{
        const {review, post_id} = req.body;
        const sanitizedReview = review.trim().replace(/[<>&"]/g, (char) => ({
            '<': '&lt;',
            '>': '&gt;',
            '&': '&amp;',
            '"': '&quot;'
        }[char]));
        const accessToken = req.cookies.accessToken;
        const decode = jwt.decode(accessToken);
        const username = decode.sub;
    
        if(!accessToken){
            return res.status(401).json({message: "Unauthorized"});
        }
        const post = await postModel.findOneAndUpdate({ _id: post_id },   { 
            $push: { 
                review: { username: username, review: sanitizedReview } 
            } 
        },
        { new: true }
    );
        res.status(201).json({message: "Review Created Successfully", post});
    
}
    catch(err){
        console.error(err);
    }
}