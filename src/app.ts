import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import { connectDB } from "./config/database.js";

dotenv.config();//.env file configuration
connectDB(); //Database connection

const PORT: number = Number(process.env.PORT) || 3000;

const app = express();

//all middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

//all routes
app.use("/api/auth", authRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome, Message from server");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
