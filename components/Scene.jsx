import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';
import Status from './status/Status';
import ShieldIcon from '@mui/icons-material/Shield';
import { createRoot } from 'react-dom/client';

export default function Scene({ app }) {
	const [registry, systems] = app.get();

	const client = systems.get('Client');
	const raycaster = systems.get('Raycaster');
	const moba = systems.get('Moba');
	const onRightClick = (e) => {
		// e.preventDefault();
		const intersection = raycaster.getCursorIntersection();
		const player = systems.get('Player');
		moba.moveToRpc(player.getPlayerEntity(), intersection.worldPosition);
	}
	useEffect(() => {
		// Log.debug(`Scene.useEffect`);
		const renderer = systems.get('Renderer')
		// const uiJsx = <div className="" style={{ marginTop: "auto", marginLeft: "auto", marginRight: "auto" }}>
		// Hii!
		// </div>
		renderer.setSceneElement(document.getElementById("scene"));
		// const root = createRoot(renderer.getDomElement());
		// root.render(uiJsx);
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
			{/* <Status sx={{
				position: 'absolute',
				mx: 'auto',
				mt: 'auto',
				height: 'fit-content',
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
			}}
				app={app}
			/> */}
			{/* <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, marginTop: "auto", marginLeft: "auto", marginRight: "auto", height: "fit-content", width: "100px", backgroundColor: 'rgba(0,0,0,0.5)' }}>
				Hi!!!
			</div> */}
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
			}}>
				{/* <div style={{
					display: 'flex',
					flex: 1,
				}}>
				</div> */}
				<div style={{
					display: 'flex',
					marginLeft: 'auto',
					marginRight: 'auto',
					marginTop: 'auto',
				}}>
					Hi!
				</div>
			</div>
			{/* <div className='row' style={{ position: "absolute", width: itemWidth * 4, backgroundColor: 'rgba(0,0,0,0.5)' }}>
				{
					[...Array(8)].map((_, i) => (
						<img src="textures/rogue.png"
							key={i}
							className='itemIcon' style={{ width: itemWidth, height: itemWidth }}
						>
						</img>
					))
				}
			</div> */}
		</Box >
	);
}