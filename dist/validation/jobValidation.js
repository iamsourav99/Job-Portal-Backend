import joi from "joi";
export const jobSchema = joi.object({
    title: joi.string().min(3).max(50).required(),
    description: joi.string().optional(),
    skills: joi.string().required(),
});
export const jobIdSchema = joi.object({
    id: joi.string().uuid().required(),
});
