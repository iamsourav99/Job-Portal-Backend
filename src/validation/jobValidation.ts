import joi from "joi";

export const jobSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().optional(),
  skills: joi.string().required(),
});

export const jobIdSchema = joi.object({
  id: joi.string().uuid().required(),
});
