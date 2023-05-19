const { join } = require('path');
const { v4 } = require('uuid');
const { gameModel, getGameModel } = require('./models/game');
const jwt = require('jsonwebtoken');
const { readFileSync, writeFileSync } = require('fs');

const USER_FILE = join(__dirname, './users.json');
const SESSIONS_FILE = join(__dirname, './sessions.json');
const GAMES_FILE = join(__dirname, './games.json');

async function fetchJson(type) {
	const file = await readFileSync(type);
	if (file.byteLength === 0) return {};
	return JSON.parse(file);
}
const exportObj = {
	generateId: async function (list) {
		const id = v4();
		if (Object.keys(await fetchJson(list))?.indexOf(id) > -1)
			return exportObj.generateId(list);
		return id;
	},
	getIdFromSession: async function (token) {
		const sessions = await fetchJson(SESSIONS_FILE);
		return Object.keys(sessions).find((id) => (sessions[id] = token));
	},
	saveSession: async function (token, userId) {
		const sessions = await fetchJson(SESSIONS_FILE);
		sessions[userId] = token;
		writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
	},
	matchToken: async function (token) {
		const currentTime = Math.floor(Date.now() / 1000);
		return new Promise(async (resolve, reject) => {
			const decoded = jwt.decode(token);
			if (decoded.exp < currentTime) reject();
			const sessions = await fetchJson(SESSIONS_FILE);
			const uid = Object.keys(sessions).find(
				(id) => (sessions[id] = token)
			);
			if (!uid) return reject();
			if (sessions[uid] === token) return resolve();
			delete sessions[uid];
			writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
		});
	},
	checkUsername: async function (username) {
		const users = await fetchJson(USER_FILE);
		return Object.keys(users).find((id) => users[id].username === username);
	},
	createUser: async function (credentials) {
		const { username, email, password } = credentials;
		const users = await fetchJson(USER_FILE);
		const uid = await exportObj.generateId(USER_FILE);
		users[uid] = {
			username,
			email,
			password,
			verified: false,
			games: [],
			characters: [],
		};
		writeFileSync(USER_FILE, JSON.stringify(users));
	},
	listUserGames: async function (id) {
		const games = await fetchJson(GAMES_FILE);
		if (!Object.keys(games).length) return {};
		const joinedGamesIds = Object.keys(games).filter(
			(gameId) => games[gameId].players[id] || games[gameId].hostId === id
		);
		const userGames = joinedGamesIds.reduce((cur, key) => {
			const val = games[key];
			return Object.assign(cur, { [key]: val });
		}, {});
		return userGames;
	},
	createGame: async function (data) {
		const newGame = getGameModel(data);
		const id = await this.generateId(GAMES_FILE);
		const gameObj = { [id]: { ...newGame } };
		return gameObj;
	},
	deleteSession: async function (token) {
		const sessionsRaw = await readFileSync(SESSIONS_FILE);
		if (sessionsRaw.byteLength === 0) return false;
		const sessions = JSON.parse(sessionsRaw);
		const userId = Object.keys(sessions).filter(
			(id) => sessions[id] === token
		)[0];
		if (!userId) return false;
		delete sessions[userId];
		writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
		return true;
	},
	saveGame: async function (gameData) {
		const [id, data] = Object.entries(gameData)[0];
		if (!(id && typeof data === 'object' && Object.keys(data)))
			return console.log('Data in wrong format');
		const games = await fetchJson(GAMES_FILE);
		games[id] = data;
		await writeFileSync(GAMES_FILE, JSON.stringify(games));
	},
};

async function deleteExpiredTokens() {
	const sessions = await fetchJson(SESSIONS_FILE);
	const currentTime = Math.floor(Date.now() / 1000);

	const validTokens = Object.keys(sessions).filter((id) => {
		const decodedToken = jwt.decode(sessions[id]);
		return decodedToken.exp < currentTime;
	});
	validTokens.map((id) => delete sessions[id]);
	writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
	console.log(sessions);
}

setInterval(deleteExpiredTokens, 6 * (60 * 60 * 1000));

module.exports = exportObj;
