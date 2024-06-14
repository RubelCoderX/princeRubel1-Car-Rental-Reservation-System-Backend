import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResonse";
import { BookingServices } from "./booking.service";

const createBooking = catchAsync(async (req, res) => {
  const booking = await BookingServices.BookingCarFromDB(req.body, req.user);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Car booked successfully",
    data: booking,
  });
});

const getAllBookings = catchAsync(async (req, res) => {
  const { carId, date } = req.query;
  const result = await BookingServices.getAllBookingsFromDB(
    carId as string,
    date as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Bookings retrieved successfully",
    data: result,
  });
});

const getMyBookings = catchAsync(async (req, res) => {
  const userEmail = req.user?.userEmail;

  // Call the service method to get bookings by user email
  const result = await BookingServices.getMyBookingsFromDB(userEmail);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My Bookings retrieved successfully",
    data: result,
  });
});

export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
};
