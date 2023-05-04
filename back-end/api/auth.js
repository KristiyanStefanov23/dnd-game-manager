const express = require('express');
const { loginUser, registerUser } = require('../data/db');
const router = express.Router();

router.post('/register', async (req, res) => {
	try {
		const { username, password } = req.body;
		registerUser(
			(resp, err) => {
				if (err)
					return res.status(err.code).json({ message: err.message });
				res.status(200).json({
					message: 'User registered successfully',
				});
			},
			{ username, password }
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.post('/login', async (req, res) => {
	try {
		const { username, password } = req.body;
		loginUser(
			(resp, err) => {
				if (err)
					return res.status(err.code).json({ message: err.message });
				const { token } = resp;
				res.status(200).json({ token });
			},
			{ username, password }
		);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
});

module.exports = router;
