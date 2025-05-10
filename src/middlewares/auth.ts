// middlewares/auth.ts
import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwtHelper.js";
import { prisma } from "../config/database.js";

// import { User } from "../generated/prisma/index.js";

//custom request for handel type of User in req
// interface CustomRequest extends Request {
//   user?: User;
// }
//fucntion to check user is authenticated or not 
export const isAuthenticated = async ( req: Request, res: Response,  next: NextFunction) => {
  try {
    let token: string;
    //reading token value
    if (req.headers["client "] === "not-browser") {
      token = req.headers.authorization!;
    } else {
      token = req.cookies["token"];
    }
    //if token not present in headers or cookies 
    if (!token) {
      res.status(401).json({ success: false, message: "Login First" });
      return;
    }
    //verify token using jwt (function written in utils/jwthelper)
    const userToken = token.split(" ")[1];
    const decoded = verifyToken(token); // Expected to return { id: string | number }

    if (!decoded || !decoded.id) {
      res.status(401).json({ success: false, message: "Invalid token" });
      return;
    }
    //find user from database using decoded user id
    const user= await prisma.user.findUnique({
      where: { id: String(decoded.id) },
    });

    //if user not found in database
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    //user added to request body
    (req as any).user = user;
    //calling next function
    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(500).json({ success: false, message: "Authentication Failed" });
  }
};

//function to check user is authorized or not 
export const authorize = (...roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user!;
  if (!roles.includes(user.role)) {
     res.status(403).json({ message: 'Forbidden: Insufficient rights' });
  }
  next();
};
