const express = require('express');
const {
	listGames,
	getGame,
	updateGame,
	deleteGame,
	createGame,
	joinGame,
} = require('../data/controllers/gameController');
const { verifyToken } = require('../data/db');

const router = express.Router();

router.post('/join/:inviteId', verifyToken, joinGame);
router.get('/', verifyToken, listGames);
router.get('/:id', verifyToken, getGame);
router.post('/', verifyToken, createGame);
router.put('/:action/:id', verifyToken, updateGame);
router.delete('/:id', verifyToken, deleteGame);

module.exports = router;
