import React, { useEffect } from 'react';
import { Sprite } from '@inlet/react-pixi';
import * as PIXI from 'pixi.js';

const PixiBackground = ({ imageSrc }) => {
	useEffect(() => {
		// Create a new PIXI loader
		const loader = new PIXI.Loader();

		// Add the image to the loader
		loader.add('background', imageSrc);

		// Listen for when the loader finishes loading the image
		loader.load(() => {
			const backgroundSprite = new PIXI.Sprite(
				loader.resources.background.texture
			);
			backgroundSprite.width = window.innerWidth;
			backgroundSprite.height = window.innerHeight;
			backgroundSprite.zIndex = -1;

			// Add the background sprite to the PIXI stage
			app.stage.addChild(backgroundSprite);
		});

		// Create a new PIXI app with a transparent background
		const app = new PIXI.Application({
			width: window.innerWidth,
			height: window.innerHeight,
			transparent: true,
		});

		// Mount the PIXI app on the DOM
		document.getElementById('game-canvas').appendChild(app.view);

		// Clean up the PIXI app when the component unmounts
		return () => {
			app.destroy(true);
		};
	}, [imageSrc]);

	return <div id='game-canvas' />;
};

export default PixiBackground;
