"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
    const match = err.message.match(/"([^"]+)"/);
    const extractMessage = match && match[1];
    const errorSource = [
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
exports.default = handleDuplicateError;
