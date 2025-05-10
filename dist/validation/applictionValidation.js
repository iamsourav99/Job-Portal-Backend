import joi from "joi";
export const applicationSchema = joi.object({
    resume: joi.string().uri().required(),
});
export const applicationId = joi.object({
    id: joi.string().uuid().required(),
});
