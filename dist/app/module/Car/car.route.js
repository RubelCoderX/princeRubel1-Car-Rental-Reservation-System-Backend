"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const car_validation_1 = require("./car.validation");
const car_controller_1 = require("./car.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../User/user.constant");
const router = express_1.default.Router();
router.put("/:id", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(car_validation_1.CarValidation.updateCarSchema), car_controller_1.CarControllers.updateCar);
// search cars
router.get("/search-cars", 
// Auth(USER_ROLE.user, USER_ROLE.admin),
car_controller_1.CarControllers.searchCars);
router.put("/return-car/:bookingId", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), car_controller_1.CarControllers.returnCar);
router.post("/", (0, auth_1.default)(user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(car_validation_1.CarValidation.carSchemaValidation), car_controller_1.CarControllers.createCar);
router.get("/", car_controller_1.CarControllers.getAllCars);
router.get("/:id", car_controller_1.CarControllers.getSingleCar);
router.delete("/:id", car_controller_1.CarControllers.deleteCar);
exports.CarRoutes = router;
