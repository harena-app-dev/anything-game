import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography, createTheme } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';
import Status from './status/Status';
import ShieldIcon from '@mui/icons-material/Shield';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { createRoot } from 'react-dom/client';
import Statusbar from './Statusbar';

export default function Scene({ app }) {
	const [registry, systems] = app.get();
	const raycaster = systems.get('Raycaster');
	const moba = systems.get('Moba');
	const onRightClick = (e) => {
		// e.preventDefault();
		const intersection = raycaster.getCursorIntersection();
		const player = systems.get('Player');
		moba.moveToRpc(player.getPlayerEntity(), intersection.worldPosition);
	}
	useEffect(() => {
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
	}, []);
	const itemWidth = 32;

	return (
		<Box className="col grow" id="scene" onContextMenu={onRightClick}>
			<div style={{
				position: 'absolute',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				display: 'flex',
				flexDirection: 'column',
				pointerEvents: 'none',
				backgroundColor: 'transparent',
			}}
			>
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
					pointerEvents: 'auto',
					flexDirection: 'column',
				}}>
					Welcome to game. Use mouse left/right click and scroll to move camera.
					<div style={{
						display: 'flex',
						flexDirection: 'column',
						width: '100%',
						padding: 0,
						margin: 0,
					}}>
						<Statusbar app={app} icon={<FavoriteIcon />} />
						<Statusbar app={app} icon={<RestaurantIcon />} />
						<Statusbar app={app} icon={<LocalDrinkIcon />} />
					</div>
				</div>
			</div>
		</Box >
	);
}