import React from 'react';
import GamePanel from '../../components/Game/gamePanel';
import GameInfo from '../../components/Game/gameInfo';
import GameActions from '../../components/Game/gameActions';
import PixiCanvas from '../../components/Game/pixi/pixiCanvas';
import './game.css';
// const cookies = Object.fromEntries(
// 	document.cookie.split('; ').map((c) => {
// 		const [key, value] = c.split('=');
// 		return [key, decodeURIComponent(value)];
// 	})
// );
function Game() {
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
}

export default Game;
