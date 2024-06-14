import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { CarValidation } from "./car.validation";
import { CarControllers } from "./car.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.post(
  "/cars",
  Auth(USER_ROLE.admin),
  validateRequest(CarValidation.carSchemaValidation),
  CarControllers.createCar
);
router.get("/cars", CarControllers.getAllCars);
router.get("/cars/:id", CarControllers.getSingleCar);
router.put(
  "/cars/:id",
  validateRequest(CarValidation.updateCarSchema),
  CarControllers.updateCar
);
router.delete("/cars/:id", CarControllers.deleteCar);

export const CarRoutes = router;
