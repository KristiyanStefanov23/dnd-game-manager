const { registerUser, loginUser, logoutUser } = require('../db');

const exportObj = {};

exportObj.register = async ({ body }, res) => {
    try {
        if (!(body?.username && body?.password && body?.email))
            return res.status(400).json({ message: 'Missing argument' });
        const { username, password, email } = body;
        registerUser(
            (resp, err) => {
                if (err)
                    return res.status(err.code).json({ message: err.message });
                res.status(200).json({
                    message: 'User registered successfully',
                });
            },
            { username, password, email }
        );
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exportObj.login = async ({ body }, res) => {
    try {
        if (!(body?.username && body?.password))
            return res.status(400).json({ message: 'Missing argument' });
        const { username, password } = body;
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
};

exportObj.logout = async (req, res) => {
    try {
        const token = req.headers['x-dnd-sessionid'];
        logoutUser(
            (resp, err) => {
                if (err)
                    return res.status(err.code).json({ message: err.message });
                res.status(200).json(resp);
            },
            { token }
        );
    } catch (error) {}
};

exportObj.ping = async (req, res) => {
    try {
        res.status(200).json({ message: 'pong' });
    } catch (error) {
        console.log(error);
    }
};

module.exports = exportObj;
