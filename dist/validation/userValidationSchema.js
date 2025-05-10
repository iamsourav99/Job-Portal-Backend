import joi from "joi";
//data required to signup
export const signupSchema = joi.object({
    email: joi.string().email().required(),
    name: joi.string().min(3).max(30).required(),
    password: joi.string().min(5).required(),
    role: joi.string().valid("APPLICANT", "RECRUITER").required(),
});
//data required to login
export const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
});
