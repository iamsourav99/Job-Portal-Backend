//function to send resonse while success
export const sendSuccess = (res, data, message = "Success", statusCode = 200, cookie) => {
    if (cookie) {
        res.cookie(cookie.name, cookie.value, cookie.options || {});
    }
    const response = {
        success: true,
        message,
    };
    if (data !== undefined) {
        response.data = data;
    }
    return res.status(statusCode).json(response);
};
//function to send response while error
export const sendError = (res, error, message = "Something went wrong", statusCode = 500) => {
    const response = {
        success: false,
        message,
    };
    if (error !== undefined) {
        response.error = error instanceof Error ? error.message : String(error);
    }
    return res.status(statusCode).json(response);
};
