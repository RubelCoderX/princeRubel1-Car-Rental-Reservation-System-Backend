import { TErrorGenericResponse, TErrorSources } from "../interface/error";

const handleDuplicateError = (err: any): TErrorGenericResponse => {
  const match = err.message.match(/"([^"]+)"/);
  const extractMessage = match && match[1];
  const errorSource: TErrorSources = [
    {
      path: "",
      message: `${extractMessage} is already exists`,
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: "Duplicate Error",
    errorSource,
  };
};

export default handleDuplicateError;
