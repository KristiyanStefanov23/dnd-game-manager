const gameModel = {
	hostId: '',
	name: '',
	players: {},
	board: {
		npc: [],
		players: [],
		boardImg: 'data:image/png;base64,',
	},
	inviteId: '',
	dateCreated: '',
	lastModified: '',
};

const characterModel = {
	playerId: '',
	position: [0, 0],
	lastLogged: '',
	dateJoined: '',
};

function getGameModel({ hostId, gameName }) {
	const newGameModel = gameModel;
	newGameModel.dateCreated = new Date().toISOString().slice(0, 10);
	newGameModel.hostId = hostId;
	newGameModel.name = gameName;
	return newGameModel;
}

function getCharacterModel({ playerId }) {
	const newCharacterModel = characterModel;
	newCharacterModel.dateJoined = new Date().toISOString().slice(0, 10);
	newCharacterModel.playerId = playerId;
	return characterModel;
}

module.exports = { getGameModel, getCharacterModel, gameModel, characterModel };
