import { model, Schema } from "mongoose";
import { TFeedBack } from "./feedBack.interface";
import moment from "moment";

const feedBackSchema = new Schema<TFeedBack>({
  name: {
    type: String,
    required: [true, "Name is required"],
  },

  message: {
    type: String,
    required: [true, "Message is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  profile: {
    type: String,
    required: [true, "Profile is required"],
  },
  date: {
    type: String,
    required: true,
    default: () => moment().format("DD-MM-YYYY"),
  },
});

export const FeedBack = model<TFeedBack>("FeedBack", feedBackSchema);
