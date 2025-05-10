import { Request, Response } from "express";
import { prisma } from "../config/database.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtHelper.js";
import { sendError, sendSuccess } from "../utils/responseHelper.js";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (user) {
      sendError(res, undefined, "User already exist", 400);
      return;
    }
    //password encryption
    const encryptPass: string = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        password: encryptPass,
        role,
      },
    });
  
    sendSuccess(res, undefined, "Register Successfully", 201);
    return;
  } catch (error) {
    sendError(res, error, "Internal Server Error", 400);
    return;
  }
};

export const userLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    // if (!req.body) {
    //   res.status(400).json({ message: "Request body is missing." });
    // }
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      sendError(res, "Not Found", "User Not Found", 404);
      return;
    }

    const isPassValid = await bcrypt.compare(password, user.password);
    if (!isPassValid) {
      sendError(res, "Authentication failed", "Incorrect password", 401);
      return;
    }

    const token = generateToken(String(user.id));

    sendSuccess(res, undefined, "Login Successfull", 200, {
      name: "token",
      value: token,
      options: {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
      },
    });
    return;
  } catch (error) {
    console.error("Error occurred:", error);
    sendError(res, error, "Internal Server Error", 500);
    return;
  }
};

export const userLogout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out Successfully",
    });
  } catch (error) {
    sendError(res, error, "Unable to Logout -- Server Error", 500);
    return;
  }
};
