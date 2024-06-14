import { ErrorRequestHandler } from "express";
import { TErrorSources } from "../interface/error";
import { ZodError } from "zod";
import handleZodError from "../error/handleZodError";
import config from "../config";
import handleValidationError from "../error/handleValidationError";
import handleCastError from "../error/handleCastError";
import handleDuplicateError from "../error/handleDuplicateError";
import AppError from "../error/AppError";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = err.message || "Something went wrong";
  let errorSource: TErrorSources = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (err instanceof ZodError) {
    const simplefiedError = handleZodError(err);
    statusCode = simplefiedError?.statusCode;
    message = simplefiedError?.message;
    errorSource = simplefiedError?.errorSource;
  } else if (err?.name === "ValidationError") {
    const simplefiedError = handleValidationError(err);
    statusCode = simplefiedError?.statusCode;
    message = simplefiedError?.message;
    errorSource = simplefiedError?.errorSource;
  } else if (err?.name === "CastError") {
    const simplefiedError = handleCastError(err);
    statusCode = simplefiedError?.statusCode;
    message = simplefiedError?.message;
    errorSource = simplefiedError?.errorSource;
  } else if (err?.code === 11000) {
    const simplefiedError = handleDuplicateError(err);
    statusCode = simplefiedError.statusCode;
    message = simplefiedError.message;
    errorSource = simplefiedError?.errorSource;
  } else if (err instanceof AppError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  } else if (err instanceof Error) {
    message = err?.message;
    errorSource = [
      {
        path: "",
        message: err?.message,
      },
    ];
  }
  // ultimate return
  return res.status(statusCode).json({
    success: false,
    message,
    errorSource,
    err,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
