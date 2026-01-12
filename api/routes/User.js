import { Router } from "express";
import loginController from "../controllers/loginController.js";
import authMiddleware from "../middlaware/index.js";
const router = Router();

router.get('/allUsers', authMiddleware, loginController.getAllUsers);
router.get('/authenticatedUser', authMiddleware, (req, res) => {
	res.json({ authenticated: true, user: req.user });
});
router.post('/login', loginController.login);
router.post('/register', loginController.register); // Temporarily using the same controller for registration
router.delete('/:id', loginController.deleteUser);
export default router;