import { Router } from "express";
import loginController from "../controllers/loginController.js";
const router = Router();


router.post('/login', loginController.login);
router.post('/register', loginController.register); // Temporarily using the same controller for registration
router.delete('/:id', loginController.deleteUser);
export default router;