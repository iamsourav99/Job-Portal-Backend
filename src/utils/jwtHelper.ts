import jwt from "jsonwebtoken";

const secret: string = process.env.JWT_SECRET!;

//to generate token
export const generateToken = (id: string): string => {
  return jwt.sign({ id }, secret);
};

//to verify token
export const verifyToken = (token: string): { id: string | number } => {
  return jwt.verify(token, secret) as { id: string | number };
};
2