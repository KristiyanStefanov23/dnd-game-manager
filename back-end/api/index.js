const { Router } = require('express');
const userRouter = require('./user');
const authRouter = require('./auth');

const router = Router();

router.use('/users', userRouter);
router.use('/auth', authRouter);

module.exports = router;
