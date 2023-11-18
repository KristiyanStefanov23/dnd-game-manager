const { writeFileSync, readFileSync, readFile } = require('fs');
const { join } = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');
const { gameModel, getGameModel } = require('./models/game');

const exportObj = {};

const SECRET_KEY = 'DnDisAboutFriends...';
const USER_FILE = join(__dirname, './users.json');
const SESSIONS_FILE = join(__dirname, './sessions.json');
const GAMES_FILE = join(__dirname, './games.json');
const SHEETS_FOLDER = join(__dirname, './sheets/');

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
exportObj.getIdFromSession = async (token) => {
    const sessions = await fetchJson(SESSIONS_FILE);
    return Object.keys(sessions).find((id) => sessions[id] === token);
};
exportObj.verifyToken = (req, res, next) => {
    const token = req.headers['x-dnd-sessionid'];
    if (!token)
        return res.status(498).json({ message: 'Token expired/invalid' });
    const currentTime = Math.floor(Date.now() / 1000);

    new Promise(async (resolve, reject) => {
        const decoded = jwt.decode(token);
        if (!decoded) return reject();
        if (decoded.exp < currentTime) return reject();
        const sessionsRaw = await readFileSync(SESSIONS_FILE);
        if (sessionsRaw.byteLength <= 0) return reject();
        const sessions = JSON.parse(sessionsRaw);
        const uid = Object.keys(sessions).find((id) => (sessions[id] = token));
        if (!uid) return reject();
        if (sessions[uid] === token) return resolve();
        delete sessions[uid];
        writeFileSync(SESSIONS_FILE, JSON.stringify(sessions));
    })
        .then(() => {
            next();
        })
        .catch(() =>
            res.status(498).json({ message: 'Token expired/invalid' })
        );
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
exportObj.registerUser = async (callback, credentials) => {
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
        const hashedPassword = await bcrypt.hash(password, saltRounds);
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

exportObj.loginUser = async (callback, credentials) => {
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
    const match = await bcrypt.compare(password, users[userId].password);
    if (!match)
        return callback(undefined, {
            code: 401,
            message: 'Wrong username or password.',
        });

    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1d' });
    saveSession(token, userId);
    return callback({ token });
};

exportObj.logoutUser = async (callback, { token }) => {
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

// Call the deleteExpiredTokens function periodically (e.g. every hour)
setInterval(deleteExpiredTokens, 12 * (60 * 60 * 1000));
//#endregion Authentication
//#region Game
/**
 *
 * @param {Object} obj
 * @param {string} obj.hostId
 * @param {string} obj.gameName
 *
 * @returns {gameModel} Game's key, data
 */
exportObj.createGame = (data) => {
    const newGame = getGameModel(data);
    const id = v4();
    const gameObj = { [id]: { ...newGame } };
    return gameObj;
};

exportObj.addToGame = async (data) => {
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

exportObj.saveGame = async (gameData) => {
    const [id, data] = Object.entries(gameData)[0];
    if (!(id && typeof data === 'object' && Object.keys(data)))
        return console.log('Data in wrong format');
    const games = await fetchJson(GAMES_FILE);
    games[id] = data;
    await writeFileSync(GAMES_FILE, JSON.stringify(games));
};

exportObj.listUserGames = async (id) => {
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

exportObj.getUserGame = async (gid, uid) => {
    const games = await exportObj.listUserGames(uid);
    return games[gid];
};

exportObj.updateGame = async (data) => {
    const result = {
        code: 200,
        success: true,
        message: '',
    };
    const { id, action, param, uid } = data;
    const games = await fetchJson(GAMES_FILE);
    if (games[id]?.hostId !== uid) {
        result.code = 401;
        result.message = 'You are not the owner of the game';
        result.success = false;
        return result;
    }
    const actions = {
        rename: async () => {
            try {
                if (!games[id]) {
                    result.message = 'No game found with that id';
                    result.code = 404;
                    result.success = false;
                    return;
                }
                games[id].name = param;
                await writeFileSync(GAMES_FILE, JSON.stringify(games));
            } catch (error) {
                result.code = 500;
                result.message = 'Server error';
                result.success = false;
            }
        },
        invite: async () => {
            const link = generateId();
            games[id].inviteId = link;
            await writeFileSync(GAMES_FILE, JSON.stringify(games));
        },
        kick: async () => {
            delete games[id].players[param];
            await writeFileSync(GAMES_FILE, JSON.stringify(games));
        },
    };
    await actions[action]();
    return result;
};
//#endregion Game
//#region Characters
exportObj.createSheet = async (userId) => {
    const id = v4();
    const users = await fetchJson(USER_FILE);
    users[userId].characters.push(id);
    await writeFileSync(USER_FILE, JSON.stringify(users));
    return true;
};

exportObj.getSheets = async (userId) => {
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

exportObj.getSheet = async (userId, sheetId) => {
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

exportObj.updateSheet = async (userId, sheetId, data) => {
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

module.exports = exportObj;
