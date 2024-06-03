import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';
import Status from './status/Status';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Scene({ app }) {
	const [registry, systems] = app.get();

	const client = systems.get('Client');
	const raycaster = systems.get('Raycaster');
	const moba = systems.get('Moba');
	const onRightClick = (e) => {
		e.preventDefault();
		const intersection = raycaster.getCursorIntersection();
		const player = systems.get('Player');
		moba.moveToRpc(player.getPlayerEntity(), intersection.worldPosition);
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
	const itemWidth = 32;
	return (
		<Box className="col grow" id="scene" onContextMenu={onRightClick}>
			<Chat sx={{
				position: 'absolute', left: 0, bottom: 0, zIndex: 1, padding: 0,
				backgroundColor: 'rgba(0,0,0,0.5)'
			}}
				app={app}
			/>
			<Status sx={{
				// position: 'absolute',
				// mx: 'auto',
				// mt: 'auto',
				// height: 'fit-content',
				// top: 0,
				// left: 0,
				// right: 0,
				// bottom: 0,
			}}

				app={app}
			/>
			<div className='row' style={{ position:"absolute", width: itemWidth*4, backgroundColor: 'rgba(0,0,0,0.5)' }}>
				{
					[...Array(8)].map((_, i) => (
							<img src="textures/rogue.png"
								key={i}
								className='itemIcon' style={{ width: itemWidth, height: itemWidth }}
								> 
							</img>
			))
				}
		</div>
		</Box >
	);
}