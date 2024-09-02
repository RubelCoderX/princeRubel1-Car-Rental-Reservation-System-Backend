"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/Auth/auth.route");
const car_route_1 = require("../module/Car/car.route");
const booking_route_1 = require("../module/Booking/booking.route");
const payment_route_1 = require("../module/Payment/payment.route");
const feedBack_route_1 = require("../module/FeedBack/feedBack.route");
const router = (0, express_1.Router)();
const moduleRoute = [
    {
        path: "/auth",
        route: auth_route_1.AuthRouter,
    },
    {
        path: "/cars",
        route: car_route_1.CarRoutes,
    },
    {
        path: "/bookings",
        route: booking_route_1.BookingRoutes,
    },
    {
        path: "/payments",
        route: payment_route_1.paymentRoutes,
    },
    {
        path: "/feedbacks",
        route: feedBack_route_1.FeedBackRoutes,
    },
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
