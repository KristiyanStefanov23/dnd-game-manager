import { Router } from 'express';
import {
	register,
	login,
	logout,
	ping,
} from '../data/controllers/authenticationController.js';
import { verifyToken } from '../data/db.js';
const router = Router();

router.post('/ping', verifyToken, ping);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', verifyToken, logout);

export default router;
