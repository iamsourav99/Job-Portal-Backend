import { Response } from "express";
//define success response type
export interface SuccessResponse<T = any> {
  success: true;
  message: string;
  data: T;
}
//define error resonse type
export interface ErrorResponse {
  success: false;
  message: string;
  error: string;
}


//function to send resonse while success
export const sendSuccess = <T>(
  res: Response,
  data?: T,
  message = "Success",
  statusCode = 200,
  cookie?: { name: string; value: string; options?: any }
): Response<SuccessResponse<T>> => {
  
  if (cookie) {
    res.cookie(cookie.name, cookie.value, cookie.options || {});
  }

  const response: any = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

//function to send response while error ocured
export const sendError = (
  res: Response,
  error?: any,
  message = "Something went wrong",
  statusCode = 500
): Response<ErrorResponse> => {
  const response: any = {
    success: false,
    message,
  };
  
  if (error !== undefined) {
    response.error = error instanceof Error ? error.message : String(error);
  }

  return res.status(statusCode).json(response);
};
