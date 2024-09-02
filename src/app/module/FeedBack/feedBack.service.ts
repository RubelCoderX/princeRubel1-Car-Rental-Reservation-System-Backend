import { TFeedBack } from "./feedBack.interface";
import { FeedBack } from "./feedBack.model";

const createFeedBack = async (payload: TFeedBack) => {
  const result = await FeedBack.create(payload);
  return result;
};
const getAllFeedBacks = async () => {
  const result = await FeedBack.find();
  return result;
};

export const FeedBackService = {
  createFeedBack,
  getAllFeedBacks,
};
