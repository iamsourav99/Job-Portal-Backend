//schema validation function (take schema as input and return middleware function )
//if validate then call next()
//if error occure then return error as json response
//validate req.body
export const validateBody = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.body);
        if (error) {
            res.status(400).json({ error: error.details[0].message });
            return;
        }
        next();
    };
};
//validate req.params
export const validateParams = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.params);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        next();
    };
};
//validate  req.query
export const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error } = schema.validate(req.query);
        if (error) {
            res.status(400).json({ message: error.details[0].message });
            return;
        }
        next();
    };
};
