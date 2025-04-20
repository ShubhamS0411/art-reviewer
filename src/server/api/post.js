import  postModel  from "../models/post.js";
import  accountModel  from "../models/account.js";
import jwt from "jsonwebtoken";


export async function createPost (req,res){
    try{
    const {content, description, file, category} = req.body;
   
    const accessToken = req.cookies.accessToken;
 
    if(!accessToken){
        return res.status(401).json({message: "Unauthorized"});
    }
    const decoded = jwt.decode(accessToken);
    const username = decoded.sub;
    
    
    if(!content){
        return res.status(400).json({message: "Content is required"});
    }

    if(!description){
        return res.status(400).json({message: "Description is required"});
    }
    const updatedContent = content.trim().replace(/[<>&"]/g, (char) => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;'
    }[char]));

    const updatedDescription = description.trim().replace(/[<>&"]/g, (char) => ({
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;'
    }[char]));
    
   
    const userExsists = await accountModel.findOne({username});
    if(!userExsists){
        return res.status(400).json({message: "User does not exist"});
    }

    const newPost = new postModel({ content: updatedContent, description: updatedDescription, user: userExsists.username, file: file, category: category, account: userExsists._id });
    await newPost.save();
    res.status(201).json({message: "Post Created Successfully, Wait For Page To Refresh"});
    }
    catch(err){
        console.error(err);
        res.status(500).json({message: "Error creating post"});
    }
}

 export async function getPosts(req, res) {
    try {
      const accessToken = req.cookies.accessToken;
      
      if (!accessToken) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      const decoded = jwt.decode(accessToken);
      const role = decoded.role;
      
      //const fiveSecond = new Date(Date.now() - 100000);
      const posts = await postModel.find({}).populate('account', 'isVerified').populate('review.account', 'isVerified').sort({ createdAt: -1 });

      
      res.status(200).json({ posts, role });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching posts' });
    }
  }