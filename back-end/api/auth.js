const express = require('express');
const {
	register,
	login,
	logout,
} = require('../data/controllers/authenticationController');
const { verifyToken } = require('../data/db');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

module.exports = router;
