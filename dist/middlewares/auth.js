import { verifyToken } from "../utils/jwtHelper.js";
import { prisma } from "../config/database.js";
//fucntion to check user is authenticated or not
export const isAuthenticated = async (req, res, next) => {
    try {
        let token;
        //reading token value
        if (req.headers["client"] === "not-browser") {
            token = req.headers.authorization;
        }
        else {
            token = req.cookies["token"];
        }
        //if token not present in headers or cookies
        if (!token) {
            res.status(401).json({ success: false, message: "Login First" });
            return;
        }
        //verify token using jwt (function written in utils/jwthelper)
        const userToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
        const decoded = verifyToken(userToken); // Expected to return { id: string | number }
        if (!decoded || !decoded.id) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        //find user from database using decoded user id
        const user = await prisma.user.findUnique({
            where: { id: String(decoded.id) },
        });
        //if user not found in database
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        //user added to request body
        req.user = user;
        //calling next function
        next();
    }
    catch (err) {
        res
            .status(500)
            .json({ success: false, message: "Authentication Failed", Error: err });
    }
};
//function to check user is authorized or not
export const authorize = (...roles) => (req, res, next) => {
    const user = req.user;
    if (!user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (!roles.includes(user.role)) {
        res.status(403).json({ message: "Forbidden: Insufficient rights" });
        return;
    }
    next();
};
