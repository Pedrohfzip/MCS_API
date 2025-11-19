import { Router } from "express";
import loginController from "../controllers/login.js";
const router = Router();


router.post('/login', loginController.login);
router.post('/register', loginController.register); // Temporarily using the same controller for registration

export default router;