import jwt from "jsonwebtoken";
const secret = process.env.JWT_SECRET;
//to generate token
export const generateToken = (id) => {
    return jwt.sign({ id }, secret);
};
//to verify token
export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};
2;
