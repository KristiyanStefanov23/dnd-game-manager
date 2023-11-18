const {
    createSheet,
    getIdFromSession,
    getSheets,
    getSheet,
    updateSheet,
} = require('../db');

const exportObj = {};

exportObj.createSheet = async function (req, res) {
    try {
        const token = req.headers['x-dnd-sessionid'];
        const uid = await getIdFromSession(token);
        await createSheet(uid);
        res.status(201).json({ message: 'Created' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exportObj.getUserSheets = async function (req, res) {
    try {
        const token = req.headers['x-dnd-sessionid'];
        const uid = await getIdFromSession(token);
        const data = await getSheets(uid);
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exportObj.getSheet = async function (req, res) {
    try {
        const { id } = req.params;
        const token = req.headers['x-dnd-sessionid'];
        const uid = await getIdFromSession(token);
        const data = await getSheet(uid, id);
        return res.status(200).json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exportObj.updateSheet = async function (req, res) {
    try {
        const { id } = req.params;
        const token = req.headers['x-dnd-sessionid'];
        const uid = await getIdFromSession(token);
        const data = req.body.data;
        const resp = updateSheet(uid, id, data);
        if (!resp) return res.status(400).json({ message: 'Bad Request' });
        return res.status(200).json({ message: 'OK' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exportObj.deleteSheet = async function (req, res) {
    try {
        const { id } = req.params;
        return res.status(501).json({ message: 'Not implemented' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = exportObj;
