import postModel from "../models/post.js";
export default async function similarPost(req,res){
    try{
        const {category, id} = req.body;
        const checkCategory = await postModel.find({category: category, _id: {$ne: id}}).limit(5);
        res.status(200).json({message: "Similar Post Found Successfully", checkCategory});
    }
    catch(err){
        console.error(err);
    }
}