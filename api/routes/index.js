import Router from 'express';
import userRouter from './User.js';
import tokenRouter from './token.js';
const router = Router();

router.use('/users', userRouter);
router.use('/token', tokenRouter);
export default router;