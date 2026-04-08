import jwt from 'jsonwebtoken';
import PresUser from '../models/presUser.js';

export const protect = async (req, res, next) => {
  try {
  ;

    const token = req.cookies.userToken;
 

    if (!token) {
      console.log("NO TOKEN FOUND");
      return res.status(401).json({ success: false, message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    const user = await PresUser.findById(decoded.id);
   

    if (!user) {
      
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();

  } catch (error) {
  
    return res.status(401).json({ success: false, message: "Token failed" });
  }
};
