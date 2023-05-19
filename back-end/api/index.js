const { Router } = require('express');
const gameRouter = require('./game');
const authRouter = require('./auth');

const router = Router();

router.use('/game', gameRouter);
router.use('/auth', authRouter);

module.exports = router;
