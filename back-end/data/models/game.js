export const gameModel = {
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

export const characterModel = {
	playerId: '',
	position: [0, 0],
	lastLogged: '',
	dateJoined: '',
};

export function getGameModel({ hostId, gameName }) {
	const newGameModel = gameModel;
	newGameModel.dateCreated = new Date().toISOString().slice(0, 10);
	newGameModel.hostId = hostId;
	newGameModel.name = gameName;
	return newGameModel;
}

export function getCharacterModel({ playerId }) {
	const newCharacterModel = characterModel;
	newCharacterModel.dateJoined = new Date().toISOString().slice(0, 10);
	newCharacterModel.playerId = playerId;
	return characterModel;
}
