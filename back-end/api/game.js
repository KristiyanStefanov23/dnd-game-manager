import { Router } from 'express';
import {
	listGames,
	getGame,
	updateGame,
	deleteGame,
	createGame,
	joinGame,
} from '../data/controllers/gameController.js';
import { verifyToken } from '../data/db.js';

const router = Router();

router.post('/join/:inviteId', verifyToken, joinGame);
router.get('/', verifyToken, listGames);
router.get('/:id', verifyToken, getGame);
router.post('/', verifyToken, createGame);
router.put('/:action/:id', verifyToken, updateGame);
router.delete('/:id', verifyToken, deleteGame);

export default router;
