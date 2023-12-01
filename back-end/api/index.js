import { Router } from 'express';
import gameRouter from './game.js';
import authRouter from './auth.js';
import charRouter from './character.js';

const router = Router();

router.use('/game', gameRouter);
router.use('/auth', authRouter);
router.use('/character', charRouter);

export default router;
