import { Router } from "express";
import { AuthRouter } from "../module/Auth/auth.route";
import { CarRoutes } from "../module/Car/car.route";
import { BookingRoutes } from "../module/Booking/booking.route";
import { paymentRoutes } from "../module/Payment/payment.route";
import { FeedBackRoutes } from "../module/FeedBack/feedBack.route";

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
  {
    path: "/payments",
    route: paymentRoutes,
  },
  {
    path: "/feedbacks",
    route: FeedBackRoutes,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
