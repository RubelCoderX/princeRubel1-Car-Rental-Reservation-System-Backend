import { Router } from "express";
import { paymentConfirmationController } from "./payment.controller";

const router = Router();
router.post("/confirmations", paymentConfirmationController);

export const paymentRoutes = router;
