const { Router } = require('express');
const gameRouter = require('./game');
const authRouter = require('./auth');
const charRouter = require('./character');

const router = Router();

router.use('/game', gameRouter);
router.use('/auth', authRouter);
router.use('/character', charRouter);

module.exports = router;
