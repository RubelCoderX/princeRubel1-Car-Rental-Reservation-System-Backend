import express from "express";
import validateRequest from "../../middleware/validateRequest";
import { CarValidation } from "./car.validation";
import { CarControllers } from "./car.controller";
import Auth from "../../middleware/auth";
import { USER_ROLE } from "../User/user.constant";

const router = express.Router();

router.put(
  "/:id",
  // Auth(USER_ROLE.admin),
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  validateRequest(CarValidation.updateCarSchema),
  CarControllers.updateCar
);
// search cars
router.get(
  "/search-cars",
  // Auth(USER_ROLE.user, USER_ROLE.admin),
  CarControllers.searchCars
);
router.put(
  "/return-car/:bookingId",
  Auth(USER_ROLE.admin),
  CarControllers.returnCar
);
router.post(
  "/",
  Auth(USER_ROLE.admin),
  validateRequest(CarValidation.carSchemaValidation),
  CarControllers.createCar
);
router.get("/", CarControllers.getAllCars);
router.get("/:id", CarControllers.getSingleCar);

router.delete("/:id", CarControllers.deleteCar);

export const CarRoutes = router;
