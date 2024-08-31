import httpStatus from "http-status";
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
  const query = req.query;

  const result = await BookingServices.getAllBookingsFromDB(query);

  result.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "Data No Found",
        data: result,
      })
    : sendResponse(res, {
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
  result.length < 1
    ? sendResponse(res, {
        success: true,
        statusCode: httpStatus.NOT_FOUND,
        message: "Data No Found",
        data: result,
      })
    : sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "My Bookings retrieved successfully",
        data: result,
      });
});

const updateBooking = catchAsync(async (req, res) => {
  const user = req.user;
  const data = req.body;
  const { bookingId } = req.params;

  const result = await BookingServices.updateBookeingFromDB(
    user,
    data,
    bookingId
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking updated successfully!",
    data: result,
  });
});

const deletedBooking = catchAsync(async (req, res) => {
  const user = req.user;

  const { bookingId } = req.params;
  const result = await BookingServices.deleteBookingFromDB(user, bookingId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking deleted successfully!",
    data: result,
  });
});
const updateBookingStatusFromDB = catchAsync(async (req, res) => {
  const user = req.user;
  const { bookingId } = req.params;

  const result = await BookingServices.updateBookingStatus(user, bookingId);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Booking status updated successfully!",
    data: result,
  });
});
export const BookingControllers = {
  createBooking,
  getAllBookings,
  getMyBookings,
  updateBooking,
  deletedBooking,
  updateBookingStatusFromDB,
};
