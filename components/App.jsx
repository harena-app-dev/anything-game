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
import Console from '@/components/Console';
export default function App() {
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
	return <Box className="row grow">
		<RegistryView registry={registry} />
		<Box className='col grow' sx={{ p: 2 }}>
			<EntityView registry={registry} entity={0} />
			<Console registry={registry} />
		</Box>
	</Box>
}