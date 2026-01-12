import Router from 'express';
import userRouter from './User.js';
import tokenRouter from './token.js';
import carRouter from './Car.js';
const router = Router();

router.use('/users', userRouter);
router.use('/token', tokenRouter);
router.use('/cars', carRouter);
export default router;