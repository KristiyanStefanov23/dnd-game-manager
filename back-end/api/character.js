const express = require('express');
const { verifyToken } = require('../data/db');
const router = express.Router();

router.post('/', verifyToken, createSheet);
router.get('/', verifyToken, getUserSheets);
router.get('/:id', verifyToken, getSheet);
router.put('/:id', verifyToken, updateSheet);
router.delete('/:id', verifyToken, deleteSheet);

module.exports = router;