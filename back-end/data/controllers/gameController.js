import {
	getUserGame,
	updateGame as dbUpdateGame,
	addToGame,
	saveGame,
	createGame as dbCreateGame,
	getIdFromSession,
	listUserGames,
} from '../db.js';

export const joinGame = async function (req, res) {
	try {
		const token = req.headers['x-dnd-sessionid'];
		const uid = await getIdFromSession(token);
		const { inviteId } = req.params;
		const { characterId } = req.body;
		const error = await addToGame({ cid: characterId, uid, iid: inviteId });
		console.log(error);
		if (error)
			return res.status(error.code).json({ message: error.message });
		return res.status(501).json({ message: 'Not implemented' });
	} catch (error) {
		console.error(error);
		res.status(200).json({ message: 'OK' });
	}
};

export const createGame = async (req, res) => {
	try {
		if (!req.body?.gameName)
			return res.status(400).json({ message: 'Missing argument' });
		const { gameName } = req.body;
		const token = req.headers['x-dnd-sessionid'];
		const uid = await getIdFromSession(token);
		const newGame = dbCreateGame({ hostId: uid, gameName });
		saveGame(newGame);
		res.status(201).json(newGame);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
	// Create a new game
};

export const deleteGame = (req, res) => {
	try {
		const { id } = req.params;
		return res.status(501).json({ message: 'Not implemented' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
	// Delete the game with the given ID
};

export const updateGame = async (req, res) => {
	try {
		const { action, id } = req.params;
		const { param } = req.body;
		const token = req.headers['x-dnd-sessionid'];
		const uid = await getIdFromSession(token);
		const result = await dbUpdateGame({ action, id, uid, param });
		if (!result.success)
			return res.status(result.code).json({ message: result.message });
		return res.status(200).json();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
	// Update the game with the given ID
};
export const listGames = async (req, res) => {
	// Return a list of games
	try {
		const token = req.headers['x-dnd-sessionid'];
		const uid = await getIdFromSession(token);
		const games = await listUserGames(uid);
		if (!Object.keys(games).length) return res.status(204).json();
		res.status(200).json(games);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
export const getGame = async (req, res) => {
	try {
		const { id } = req.params;
		const token = req.headers['x-dnd-sessionid'];
		const uid = await getIdFromSession(token);
		const game = await getUserGame(id, uid);
		if (!game) return res.status(404).json({ message: 'Game not found' });
		return res.status(200).json(game);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
	// Return the game with the given ID
};
