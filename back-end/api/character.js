import { Router } from 'express';
import { verifyToken } from '../data/db.js';
import {
	createSheet,
	getUserSheets,
	updateSheet,
	deleteSheet,
	getSheet,
} from '../data/controllers/characterController.js';
const router = Router();

router.post('/', verifyToken, createSheet);
router.get('/', verifyToken, getUserSheets);
router.get('/:id', verifyToken, getSheet);
router.put('/:id', verifyToken, updateSheet);
router.delete('/:id', verifyToken, deleteSheet);

export default router;
