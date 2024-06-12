import { Router } from "express";
import { AuthRouter } from "../module/Auth/auth.route";

const router = Router();

const moduleRoute = [
  {
    path: "/auth",
    route: AuthRouter,
  },
];

moduleRoute.forEach((route) => router.use(route.path, route.route));

export default router;
