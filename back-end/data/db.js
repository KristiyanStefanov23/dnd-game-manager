const { writeFileSync, readFileSync } = require('fs');
const { join } = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4 } = require('uuid');

const exportFunc = {};
const SECRET_KEY = 'your-secret-key';
const USER_FILE = join(__dirname, 'auth.json');
const PROF_FILE = join(__dirname, 'prof.json');

exportFunc.registerUser = async (callback, credentials) => {
	try {
		const { username, password } = credentials;
		// Check if user already exists
		const usersRaw = await readFileSync(USER_FILE);
		const users = JSON.parse(usersRaw.byteLength === 0 ? '{}' : usersRaw);
		if (users[username])
			return callback(undefined, {
				code: 400,
				message: 'This username already exists.',
			});
		// Hash password
		const saltRounds = 6;
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		//create a user object with relation to id for character sheets and game\
		const profilesRaw = await readFileSync(PROF_FILE);
		const profiles = JSON.parse(
			profilesRaw.byteLength === 0 ? '{}' : profilesRaw
		);
		// make sure the id is unique
		const uid = generateId(Object.keys(profiles));
		users[username] = {
			id: uid,
			password: hashedPassword,
		};
		//save the user credentials and id
		writeFileSync(USER_FILE, JSON.stringify(users));
		profiles[uid] = { games: [], characters: [] };
		writeFileSync(PROF_FILE, JSON.stringify(profiles));
		return callback('ok');
	} catch (err) {
		return callback(undefined, { code: 500, message: 'Server error' });
	}
};

exportFunc.loginUser = async (callback, credentials) => {
	const { username, password } = credentials;
	// Read users from file
	const usersRaw = await readFileSync(USER_FILE);
	if (usersRaw.byteLength === 0)
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});
	const users = JSON.parse(usersRaw);
	// Find user by username
	const user = users[username];

	// If user not found, send 401 Unauthorized status
	if (!user)
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});

	// Compare password with hash
	const match = await bcrypt.compare(password, user.password);

	// If password doesn't match, send 401 Unauthorized status
	if (!match)
		return callback(undefined, {
			code: 401,
			message: 'Wrong username or password.',
		});

	// Generate JWT
	const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
	return callback({ token });
};

module.exports = exportFunc;

function generateId(list = []) {
	const id = v4();
	if (list.indexOf(id) > -1) return generateId(list);
	return id;
}
