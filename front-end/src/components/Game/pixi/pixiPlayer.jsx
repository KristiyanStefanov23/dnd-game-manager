import React, { useEffect, useState } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const PixiPlayer = ({ spriteSrc }) => {
	const [playerSprite, setPlayerSprite] = useState(null);

	useEffect(() => {
		// Create a new PIXI loader
		const loader = new PIXI.Loader();

		// Add the sprite to the loader
		loader.add('player', spriteSrc);

		// Listen for when the loader finishes loading the sprite
		loader.load(() => {
			const sprite = new PIXI.Sprite(loader.resources.player.texture);
			sprite.x = window.innerWidth / 2;
			sprite.y = window.innerHeight / 2;
			sprite.anchor.set(0.5);
			setPlayerSprite(sprite);
		});

		// Create a new PIXI ticker that updates the player sprite position
		const ticker = new PIXI.Ticker();
		ticker.add(() => {
			if (playerSprite) {
				playerSprite.x += 1;
				playerSprite.y += 1;
			}
		});
		ticker.start();

		// Clean up the PIXI ticker when the component unmounts
		return () => {
			ticker.stop();
		};
	}, [spriteSrc]);

	return playerSprite && <Sprite {...playerSprite} />;
};

export default PixiPlayer;
