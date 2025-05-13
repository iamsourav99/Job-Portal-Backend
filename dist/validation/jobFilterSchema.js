import joi from 'joi';
export const jobFilterSchema = joi.object({
    title: joi.string().min(3).max(50).optional(),
    postDate: joi.string().isoDate().optional(),
    skills: joi.string().optional(),
    page: joi.number().min(1).default(1),
    limit: joi.number().min(1).max(100).default(5),
    sortBy: joi.string().default("id"),
    order: joi.string().valid("asc", "desc").default("desc"),
});
