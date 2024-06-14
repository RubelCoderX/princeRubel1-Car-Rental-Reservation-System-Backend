import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { CarValidation } from "./car.validation";
import { CarControllers } from "./car.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.put("/return", Auth(USER_ROLE.admin), CarControllers.returnCar);
router.post(
  "/",
  Auth(USER_ROLE.admin),
  validateRequest(CarValidation.carSchemaValidation),
  CarControllers.createCar
);
router.get("/", CarControllers.getAllCars);
router.get("/:id", CarControllers.getSingleCar);
router.put(
  "/:id",
  validateRequest(CarValidation.updateCarSchema),
  CarControllers.updateCar
);
router.delete("/:id", CarControllers.deleteCar);

export const CarRoutes = router;
