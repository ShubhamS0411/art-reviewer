export const logout = (req, res) => {
    try{
    const {state} = req.body
    if(!state){
      
      res.clearCookie("accessToken");
    res.clearCookie("refreshtoken");
    res.status(200).json({ message: "Logout successful" });  
    }
}
catch(err){
    console.error(err);
}
    
};