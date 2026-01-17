import { Router } from "express";
import CarController from "../controllers/CarController.js";
import authMiddleware from "../middlaware/index.js";
import upload from "../middlaware/uploadImage.js";
const router = Router();

router.get('/getAllCars', CarController.getAllCars);
router.post('/createCar', authMiddleware, upload.single('imagem'), CarController.create);
router.get('/getCar/:id', CarController.getCarById);
export default router;