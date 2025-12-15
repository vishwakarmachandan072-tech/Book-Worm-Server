import jwt from 'jsonwebtoken';
import User from '../models/Users.js';

/*
const response = await fetch(`http://localhost:3000/api/books`, {
    method: "POST",
    body: JSON.stringify({
    title,
    caption,
    }),
    header: { Authorization: `Bearer ${token}` },
});
*/

const protectRoute = async (req,res,next) => {
    try {
        //get token
        const token = req.header("Authorization").replace("Bearer ", "");
        console.log("Toek from protet route", token);

        //check if there is token or not
        if(!token) return res.status(401).json({ message: "No authentication token, acces denied" });

        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decode from protected: ",decoded);

        //find user
        const user = await User.findById(decoded.userId).select("-password"); //select every field but not password
        console.log(user);
        
        if(!user) return res.status(401).json({ message: "Token is not valid" }); 

        req.user = user;
        next();
    } catch (error) {
        console.log("Authentication error: ", error.message)   ;
        res.status(401).json({ message: "Token is not valid" });
    }
}

export default protectRoute;