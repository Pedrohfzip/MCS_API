import { Router } from "express";
import CarController from "../controllers/CarController.js";
import authMiddleware from "../middlaware/index.js";
const router = Router();

router.get('/getAllCars', CarController.getAllCars);
router.post('/createCar', authMiddleware ,CarController.create);

export default router;