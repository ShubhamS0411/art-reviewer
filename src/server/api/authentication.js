
export default function Authentication(req,res){
   const accessToken = req.cookies.accessToken;
    if(!accessToken){
        return res.status(401).json({message: "Unauthorized"});
    }
    res.status(200).json({message: "Authorized"});
}