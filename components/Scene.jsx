import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';

export default function Scene({ registry, systems }) {
	const client = systems.get('Client');
	const raycaster = systems.get('Raycaster');
	const moba = systems.get('Moba');
	const onRightClick = (e) => {
		e.preventDefault();
		// moba.cmdMoveTo(
		// client.promiseCreate().then((entity) => {
		// 	client.promiseEmplace("MoveGoal", entity, { x: e
		// })
	}
	useEffect(() => {
		// Log.debug(`Scene.useEffect`);
		const renderer = systems.get('Renderer')
		renderer.setSceneElement(document.getElementById("scene"));
		function loop() {
			requestAnimationFrame(loop);
			systems.tick();	
		}
		loop();
		return () => {
			Log.debug(`Scene.useEffect return`);
			renderer.onSceneElementResize();
		};
		// const intervalId = setInterval(() => {
		// 	// console.log('This will run every second');
		// 	systems.tick();
		// 	// 	requestAnimationFrame(loop);
		// }, 1000 / 100);

		// Cleanup function
		// return () => {
		// 	clearInterval(intervalId);
		// };
	}, []);
	return (
		<Box className="col grow" id="scene" onContextMenu={onRightClick}>
			<Chat sx={{
				position: 'absolute', left: 0, bottom: 0, zIndex: 1, padding: 0,
				backgroundColor: 'rgba(0,0,0,0.5)'
			}}
				registry={registry}
				systems={systems} />
		</Box>
	);
}