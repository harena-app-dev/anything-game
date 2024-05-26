'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import RegistryView from '@/components/RegistryView';
import { createNetworkedRegistry } from '@/scripts/createNetworkedRegistry';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Entity from '@/scripts/dnd/Entity';
import EntityView from '@/components/EntityView';

const Item = styled(Paper)(({ theme }) => ({
	backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
	...theme.typography.body2,
	padding: theme.spacing(1),
	textAlign: 'center',
	color: theme.palette.text.secondary,
}));



const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState([]);
	const webSocketMessager = useRef();
	const [registry, setRegistry] = useState(createNetworkedRegistry());
	useEffect(function () {
		webSocketMessager.current = new WebSocketMessager(function () {
			registry.connect({ wsm: webSocketMessager.current, isClient: true });
		});
		return () => {
			webSocketMessager.current?.close();
		};
	}, []);
	return <ThemeProvider theme={darkTheme}>
		<CssBaseline />
		<Box className="row grow">
			<RegistryView registry={registry} />
			<Box className='col grow' sx={{ p: 2 }}>
				<EntityView registry={registry} entity={0} />
				<Box className='col grow' >
					<div className='row title'>
						Console
					</div>
					<div className='col grow ui'>
						{consoleMessages.map((message, index) => <div className='row' key={index}>{message}</div>)}
					</div>
					<div className='row'>
						<input className='grow' type="text" />
					</div>
				</Box>
			</Box>
		</Box>

	</ThemeProvider>
}
