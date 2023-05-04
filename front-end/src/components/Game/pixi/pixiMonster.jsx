import React, { useEffect, useState } from 'react';
import { Texture, Sprite } from 'pixi.js';

const PixiMonster = ({ monster }) => {
	const [monsterSprite, setMonsterSprite] = useState(null);

	useEffect(() => {
		const monsterTexture = Texture.from('assets/monster.png');
		const monsterSprite = new Sprite(monsterTexture);
		monsterSprite.anchor.set(0.5);
		monsterSprite.x = monster.x;
		monsterSprite.y = monster.y;

		setMonsterSprite(monsterSprite);
	}, [monster]);

	useEffect(() => {
		if (monsterSprite) {
			monsterSprite.x = monster.x;
			monsterSprite.y = monster.y;
		}
	}, [monster, monsterSprite]);

	return <>{monsterSprite}</>;
};

export default PixiMonster;
