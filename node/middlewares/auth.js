import jwt from "jsonwebtoken";

export const ensureAuthenticated = (req,res,next)=>{
    const auth = req.headers['authorization'];
    if(!auth){
        return res.status(403).json({message: " Unauthorized, JWT token is require"});
    }
    try{    
        const decoded = jwt.verify(auth, process.env.JWT_SECRET);
        req.user = decoded; // can be used for subsequent API call without calling db / good practice to save frequent db call
        next();
    } catch(error) {
        return res.status(403).json({ message: "Unauthorized, JWT token wrong or expired"});
    }
}