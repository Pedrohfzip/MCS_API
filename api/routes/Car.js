import { Router } from "express";
import CarController from "../controllers/CarController.js";
import authMiddleware from "../middlaware/index.js";
import upload from "../middlaware/uploadImage.js";
const router = Router();

router.get('/getAllCars', CarController.getAllCars);
router.get('/search', CarController.search);
router.post('/createCar', authMiddleware, upload.array('imagens'), CarController.create);
router.get('/getCar/:id', CarController.getCarById);
router.put('/editCar/:id', authMiddleware, upload.array('imagens'), CarController.update);
router.delete('/deleteCar/:id', authMiddleware, CarController.delete);
export default router;