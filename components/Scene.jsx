import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import { Alert, LinearProgress, Stack, TextField, Typography } from '@mui/material';
import Log from '@/scripts/Log';
import Chat from './Chat';
import Status from './status/Status';
import ShieldIcon from '@mui/icons-material/Shield';
import FavoriteIcon from '@mui/icons-material/Favorite';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalDrinkIcon from '@mui/icons-material/LocalDrink';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
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
		const theme = app.theme;
		theme.palette["health"] = {
			main: 'green',
		};
		app.setTheme(theme);
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
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
							margin: 0,
							padding: 0,
						}}>
							<div style={{
							}}>
								<Typography variant="h6" component="div" gutterBottom>
									<FavoriteIcon />
								</Typography>
							</div>
							<div style={{
								width: '100%',
							}}>
								<LinearProgress variant="determinate"
									value={75}
									color="primary"
									sx={{
										height: 25,
									}}
								/>
							</div>
						</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
						}}>
							<div style={{
							}}>
								<Typography variant="h6" component="div" gutterBottom>
									<RestaurantIcon />
								</Typography>
							</div>
							<div style={{
								width: '100%',
							}}>
								<LinearProgress variant="determinate"
									value={75}
									color="primary"
									sx={{
										height: 25,
									}}
								/>
							</div>
						</div>
						<div style={{
							display: 'flex',
							flexDirection: 'row',
							width: '100%',
						}}>
							<div style={{
							}}>
								<Typography variant="h6" component="div" gutterBottom>
									<LocalDrinkIcon />
								</Typography>
							</div>
							<div style={{
								width: '100%',
							}}>
								<LinearProgress variant="determinate"
									value={75}
									color="primary"
									sx={{
										height: 25,
									}}
								/>
							</div>
						</div>
					</div>
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