import express from "express";
import { registerUser, userLogin, userLogout } from "../controllers/authController.js";
import { validateBody } from "../middlewares/validationMiddileware.js";
import { loginSchema, signupSchema } from "../validation/userValidationSchema.js";
import { isAuthenticated } from "../middlewares/auth.js";
const router = express.Router(); //creating mini express app
//base url for authentication /api/auth/....
router.post("/signup", validateBody(signupSchema), registerUser);
router.get("/signin", validateBody(loginSchema), userLogin);
router.post("/signout", isAuthenticated, userLogout);
export default router;
