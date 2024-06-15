"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const booking_validation_1 = require("./booking.validation");
const booking_controller_1 = require("./booking.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(booking_validation_1.BookingValidation.BookingValidationSchema), booking_controller_1.BookingControllers.createBooking);
router.get("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), booking_controller_1.BookingControllers.getAllBookings);
router.get("/my-bookings", (0, auth_1.default)(user_constant_1.USER_ROLE.user), booking_controller_1.BookingControllers.getMyBookings);
exports.BookingRoutes = router;
