import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { BookingValidation } from "./booking.validation";
import { BookingControllers } from "./booking.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.patch(
  "/update-booking/:bookingId",
  Auth(USER_ROLE.user),
  BookingControllers.updateBooking
);
router.post(
  "/",
  Auth(USER_ROLE.user),
  validateRequest(BookingValidation.BookingValidationSchema),
  BookingControllers.createBooking
);

router.delete(
  "/delete-booking/:bookingId",
  Auth(USER_ROLE.user, USER_ROLE.admin),
  BookingControllers.deletedBooking
);
router.get("/", Auth(USER_ROLE.admin), BookingControllers.getAllBookings);
router.get(
  "/my-bookings",
  Auth(USER_ROLE.user),
  BookingControllers.getMyBookings
);
router.patch(
  "/update-booking-status/:bookingId",
  Auth(USER_ROLE.admin),
  BookingControllers.updateBookingStatusFromDB
);

export const BookingRoutes = router;
