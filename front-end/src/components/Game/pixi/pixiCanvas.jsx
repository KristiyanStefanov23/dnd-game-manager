import React, { useRef, useEffect } from 'react';
import * as PIXI from 'pixi.js';

const PixiCanvas = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const app = new PIXI.Application({
			view: canvas,
		});
		const handleResize = () => {
			const { innerWidth, innerHeight } = window;
			const panel = innerWidth <= 1000 ? innerWidth * 0.1 : 200;
			app.renderer.resize(innerWidth - panel * 2, innerHeight);
		};
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	return <canvas ref={canvasRef} />;
};

export default PixiCanvas;
