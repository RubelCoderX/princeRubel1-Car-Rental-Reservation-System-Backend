import express from "express";
import { FeedBackControllers } from "./feedBack.controller";

const router = express.Router();

router.post("/create-feedback", FeedBackControllers.createFeedBack);
router.get("/get-all-feedbacks", FeedBackControllers.getAllFeedBacks);

export const FeedBackRoutes = router;
