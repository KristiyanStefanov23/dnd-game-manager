import { Link } from 'react-router-dom';
import style from './panel.module.css';
import { useState } from 'react';

function GamePanel() {
	const [panel, setPanel] = useState(-1);
	function togglePanel() {}
	return (
		<div className={style.panel}>
			<h2 className='title'>Games</h2>
			<div className={style.gameList}>
				<p>
					Test <Link to={'test'}>Join</Link>
				</p>
			</div>
			<div className={style.gameBtns}>
				<button onClick={() => togglePanel()}>Create</button>
				<button onClick={() => togglePanel()}>Join</button>
			</div>
		</div>
	);
}

export default GamePanel;
