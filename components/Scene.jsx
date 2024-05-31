import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';

export default function Scene({ registry, systems }) {
	useEffect(() => {
		Log.debug(`Scene.useEffect`);
		const renderer = systems.get('Renderer')
		renderer.setSceneElement(document.getElementById("scene"));
		function loop() {
			systems.tick();
			requestAnimationFrame(loop);
		}
		loop();
		return () => {
			renderer.onSceneElementResize();
		};
	});
	return (
		<Box className="col grow" id="scene">
			<Chat sx={{ position: 'absolute', left: 0, bottom: 0, zIndex: 1, padding: 2 }} registry={registry} systems={systems} />
		</Box>
	);
}