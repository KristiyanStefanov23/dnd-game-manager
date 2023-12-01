import { writeFileSync, readFileSync, readFile } from 'fs';
import { join } from 'path';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 } from 'uuid';
import { gameModel, getGameModel } from './models/game.js';

const SECRET_KEY = 'DnDisAboutFriends...';
const USER_FILE = 'data/users.json';
const SESSIONS_FILE = 'data/sessions.json';
const GAMES_FILE = 'data/games.json';
const SHEETS_FOLDER = 'data/sheets/';

async function fetchJson(type) {
	const file = await readFileSync(type);
	if (file.byteLength === 0) return {};
	return JSON.parse(file);
}

function generateId(list) {
	const id = v4();
	if (list?.indexOf(id) > -1) return generateId(list);
	return id;
}
async function saveSession(token, userId) {
	const sessions = await fetchJson(SESSIONS_FILE);
	sessions[userId] = token;
	writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
}
//#region Authentication
export const getIdFromSession = async (token) => {
	const sessions = await fetchJson(SESSIONS_FILE);
	return Object.keys(sessions).find((id) => sessions[id] === token);
};
export const verifyToken = async (req, res, next) => {
	const token = req.headers['x-dnd-sessionid'];
	if (!token) return res.status(498).json({ message: 'Invalid token' });
	const currentTime = Math.floor(Date.now() / 1000);

	const decoded = jwt.decode(token);
	if (decoded && decoded.exp < currentTime) {
		deleteSession(token);
		return res.status(498).json({ message: 'Token expired' });
	}

	const sessionsRaw = await readFileSync(SESSIONS_FILE);
	const sessions = sessionsRaw.byteLength <= 0 ? {} : JSON.parse(sessionsRaw);
	const uid = Object.keys(sessions).find((id) => (sessions[id] = token));
	if (!uid) return res.status(498).json({ message: 'Token expired/invalid' });
	next();
};

const deleteSession = async (token) => {
	const sessions = await fetchJson(SESSIONS_FILE);
	const userId = Object.keys(sessions).filter(
		(id) => sessions[id] === token
	)[0];
	if (!userId) return false;
	delete sessions[userId];
	writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
	return true;
};
export const registerUser = async (callback, credentials) => {
	try {
		const { username, password, email } = credentials;
		const users = await fetchJson(USER_FILE);
		if (Object.keys(users).find((id) => users[id].username === username))
			return callback(undefined, {
				code: 400,
				message: 'This username already exists.',
			});
		// Hash password
		const saltRounds = 6;
		const hashedPassword = await hash(password, saltRounds);
		// make sure the id is unique
		const uid = generateId(Object.keys(users));
		users[uid] = {
			username,
			email,
			password: hashedPassword,
			verified: false,
			games: [],
			characters: [],
		};
		//save the user credentials and id
		writeFileSync(USER_FILE, JSON.stringify(users));
		return callback('ok');
	} catch (err) {
		return callback(undefined, { code: 500, message: 'Server error' });
	}
};

export const loginUser = async (callback, credentials) => {
	const { username, password } = credentials;
	const users = await fetchJson(USER_FILE);
	if (!Object.keys(users))
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});
	const userId = Object.keys(users).find(
		(id) => users[id].username === username
	);
	if (!userId)
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});
	const match = await compare(password, users[userId].password);
	if (!match)
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});

	const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
	saveSession(token, userId);
	return callback({ token });
};

export const logoutUser = async (callback, { token }) => {
	const tokenDeleted = await deleteSession(token);
	if (tokenDeleted) return callback({ message: 'Successfully Logged out' });
};

const deleteExpiredTokens = async () => {
	const sessions = await fetchJson(SESSIONS_FILE);
	const currentTime = Math.floor(Date.now() / 1000);

	const validTokens = Object.keys(sessions).filter((id) => {
		const decodedToken = jwt.decode(sessions[id]);
		return decodedToken.exp < currentTime;
	});
	validTokens.map((id) => delete sessions[id]);
	writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
};

setInterval(deleteExpiredTokens, 12 * (60 * 60 * 1000));
//#endregion Authentication
//#region Game
/**
 * @param {{hostId: string, gameName: string}} data
 * @returns {gameModel} Game's key, data
 */
export const createGame = (data) => {
	const newGame = getGameModel(data);
	const id = v4();
	const gameObj = { [id]: { ...newGame } };
	return gameObj;
};

export const addToGame = async (data) => {
	const { cid, uid, iid } = data;
	const users = await fetchJson(USER_FILE);
	const games = await fetchJson(GAMES_FILE);
	const gameId = Object.keys(games).find((id) => games[id].inviteId === iid);
	if (!gameId) return false;
	if (users[uid].games.indexOf(gameId) < 0) users[uid].games.push(gameId);
	games[gameId].players[uid] = cid;
	await writeFileSync(USER_FILE, JSON.stringify(users));
	await writeFileSync(GAMES_FILE, JSON.stringify(games));
	return true;
};

export const saveGame = async (gameData) => {
	const [id, data] = Object.entries(gameData)[0];
	if (!(id && typeof data === 'object' && Object.keys(data)))
		return console.log('Data in wrong format');
	const games = await fetchJson(GAMES_FILE);
	games[id] = data;
	writeFileSync(GAMES_FILE, JSON.stringify(games));
};

export const listUserGames = async (id) => {
	const games = await fetchJson(GAMES_FILE);
	const joinedGamesIds = Object.keys(games).filter(
		(gameId) => games[gameId].players?.[id] || games[gameId].hostId === id
	);
	const userGames = joinedGamesIds.reduce((cur, key) => {
		const val = games[key];
		return Object.assign(cur, { [key]: val });
	}, {});
	return userGames;
};

export const getUserGame = async (gid, uid) => {
	const games = await listUserGames(uid);
	return games[gid];
};

export const updateGame = async (data) => {
	const result = {
		code: 200,
		success: true,
		message: 'OK',
	};
	const { id, action, param, uid } = data;
	const games = await fetchJson(GAMES_FILE);
	if (games[id]?.hostId !== uid)
		return {
			code: 401,
			message: 'You are not the owner of the game',
			success: false,
		};

	const actions = {
		rename: async () => {
			try {
				if (!games[id])
					return {
						code: 404,
						message: 'No game found with that id',
						success: false,
					};

				games[id].name = param;
				writeFileSync(GAMES_FILE, JSON.stringify(games));
			} catch (error) {
				result.code = 500;
				result.message = 'Server error';
				result.success = false;
			}
		},
		invite: async () => {
			const link = generateId();
			games[id].inviteId = link;
			writeFileSync(GAMES_FILE, JSON.stringify(games));
		},
		kick: async () => {
			delete games[id].players[param];
			writeFileSync(GAMES_FILE, JSON.stringify(games));
		},
	};
	await actions[action]();
	return result;
};
//#endregion Game
//#region Characters
export const createSheet = async (userId) => {
	const id = v4();
	const users = await fetchJson(USER_FILE);
	users[userId].characters.push(id);
	await writeFileSync(USER_FILE, JSON.stringify(users));
	return true;
};

export const getSheets = async (userId) => {
	const users = await fetchJson(USER_FILE);
	const characterIds = users[userId].characters;
	const data = {};
	await Promise.all(
		characterIds.map(async (id) => {
			try {
				const sheetRaw = await readFileSync(
					__dirname + `/sheets/${id}.json`
				);
				if (!sheetRaw.byteLength) throw new Error('File not found');
				const name = JSON.parse(sheetRaw).name;
				if (!name) throw new Error('Sheet is empty');
				data[id] = name;
			} catch (error) {
				data[id] = 'New Character';
			}
		})
	);
	return data;
};

export const getSheet = async (userId, sheetId) => {
	const users = await fetchJson(USER_FILE);
	const characterIds = users[userId].characters;
	try {
		if (!characterIds.filter((id) => id === sheetId).length)
			throw new Error('File not found');
		const file = await readFileSync(__dirname + `/sheets/${sheetId}.json`);
		if (!file.byteLength) throw new Error('File not found');
		return JSON.parse(file);
	} catch (error) {
		return {};
	}
};

export const updateSheet = async (userId, sheetId, data) => {
	const users = await fetchJson(USER_FILE);
	const characterIds = users[userId].characters;
	try {
		if (!characterIds.filter((id) => id === sheetId).length)
			throw new Error('File not found');
		writeFileSync(
			__dirname + `/sheets/${sheetId}.json`,
			JSON.stringify(data)
		);
		return true;
	} catch (error) {
		return false;
	}
};
//#endregion Characters
