"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../module/Auth/auth.route");
const car_route_1 = require("../module/Car/car.route");
const booking_route_1 = require("../module/Booking/booking.route");
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
];
moduleRoute.forEach((route) => router.use(route.path, route.route));
exports.default = router;
