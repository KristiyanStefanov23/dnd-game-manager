import React from 'react';

const GameInfo = () => {
	return (
		<div>
			<h3>{'Yoshikage Kira'}</h3>
			<hr />
			<p>
				Level: {3} {'Rogue'}/Level: {3} {'Artificer'}
			</p>
			<ul>
				<li>Str: 12</li>
				<li>Dex: 12</li>
				<li>Con: 12</li>
				<li>Cha: 12</li>
				<li>Wis: 12</li>
				<li>Int: 12</li>
				<li>Passive perception</li>
				<li>AC: 18</li>
			</ul>
		</div>
	);
};

export default GameInfo;
