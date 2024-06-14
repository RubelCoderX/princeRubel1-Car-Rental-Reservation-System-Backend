import { Router } from "express";
import { AuthRouter } from "../module/Auth/auth.route";
import { CarRoutes } from "../module/Car/car.route";
import { BookingRoutes } from "../module/Booking/booking.route";

const router = Router();

const moduleRoute = [
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/cars",
    route: CarRoutes,
  },
  {
    path: "/bookings",
    route: BookingRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
