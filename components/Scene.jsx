import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import * as THREE from 'three';
import SpriteRenderer from '@/scripts/SpriteRender';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';

export default function Scene({ registry, systems }) {
	useEffect(() => {
		Log.info(`Scene.useEffect`);
		const renderer = systems.get('Renderer')
		renderer.setSceneElement(document.getElementById("scene"));
		function loop() {
			systems.tick();
			requestAnimationFrame(loop);
		}
		loop();
		return () => { };
	});
	return (
		<Box className="col grow" id="scene">
			<Box sx={{ position: 'absolute', left: 0, bottom: 0, zIndex: 1, padding: 2 }}>
				<Stack spacing={2}>
					<Typography variant="h6">You have joined the game!</Typography>
					<TextField label="Send a message" variant="outlined" />
				</Stack>
			</Box>
		</Box>
	);
}