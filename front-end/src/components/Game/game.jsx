import React from 'react';
import GamePanel from './gamePanel';
import GameInfo from './gameInfo';
import GameActions from './gameActions';
import PixiCanvas from './pixi/pixiCanvas';
import './game.css';
// const cookies = Object.fromEntries(
// 	document.cookie.split('; ').map((c) => {
// 		const [key, value] = c.split('=');
// 		return [key, decodeURIComponent(value)];
// 	})
// );
const Game = () => {
	return (
		<div className='game-container'>
			<GamePanel>
				<GameInfo />
			</GamePanel>
			<PixiCanvas />
			<GamePanel>
				<GameActions />
			</GamePanel>
		</div>
	);
};

export default Game;
