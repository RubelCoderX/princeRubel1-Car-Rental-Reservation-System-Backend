import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { FeedBackService } from "./feedBack.service";

const createFeedBack = catchAsync(async (req, res) => {
  const feedBack = await FeedBackService.createFeedBack(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FeedBack created successfully!",
    data: feedBack,
  });
});
const getAllFeedBacks = catchAsync(async (req, res) => {
  const feedBacks = await FeedBackService.getAllFeedBacks();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "FeedBacks retrieved successfully!",
    data: feedBacks,
  });
});

export const FeedBackControllers = {
  createFeedBack,
  getAllFeedBacks,
};
