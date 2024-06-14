import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidation } from "./booking.validation";
import { BookingControllers } from "./booking.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/bookings",
  Auth(USER_ROLE.user),
  validateRequest(BookingValidation.BookingValidationSchema),
  BookingControllers.createBooking
);

export const BookingRoutes = router;
