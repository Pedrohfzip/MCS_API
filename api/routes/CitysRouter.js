import { Router } from "express";
import CityController from "../controllers/CityController.js";
const router = Router();

router.get('/getCities', CityController.getAllCitys)

export default router;