const exportObj = {};

exportObj.createSheet = async function (req, res) {
	try {
		return res.status(501).json({ message: 'Not implemented' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
exportObj.getUserSheets = async function (req, res) {
	try {
		return res.status(501).json({ message: 'Not implemented' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
exportObj.getSheet = async function (req, res) {
	try {
		const { id } = req.params;
		return res.status(501).json({ message: 'Not implemented' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: 'Server error' });
	}
};
exportObj.updateSheet = async function (req, res) {
	try {
		const { id } = req.params;
		return res.status(501).json({ message: 'Not implemented' });
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
