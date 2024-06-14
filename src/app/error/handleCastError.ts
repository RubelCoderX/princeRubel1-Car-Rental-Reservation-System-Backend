import mongoose from "mongoose";
import { TErrorGenericResponse } from "../interface/error";

const handleCastError = (
  err: mongoose.Error.CastError
): TErrorGenericResponse => {
  const errorSource = [
    {
      path: err.path,
      message: err.message,
    },
  ];
  const statusCode = 400;
  return {
    statusCode,
    message: "Invalid Id",
    errorSource,
  };
};

export default handleCastError;
