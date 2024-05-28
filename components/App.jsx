import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import RegistryView from '@/components/ecs/RegistryView';
import { NetworkedRegistry as NetworkedRegistry } from '@/scripts/NetworkedRegistry';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Entity from '@/scripts/dnd/Entity';
import EntityView from '@/components/ecs/EntityView';
import Console from '@/components/Console';
import Scene from './Scene';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
export default function App() {
	const webSocketMessager = useRef();
	const [registry, setRegistry] = useState(NetworkedRegistry());
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState('');
	const [snackbarSeverity, setSnackbarSeverity] = useState('info');
	const handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		setIsSnackbarOpen(false);
	};

	useEffect(function () {
		function onNotification({ entity, component }) {
			const { message, severity } = component;
			setIsSnackbarOpen(true);
			setSnackbarMessage(message);
			setSnackbarSeverity(severity);
		};
		registry.onEmplace['Notification'].connect(onNotification);
		webSocketMessager.current = new WebSocketMessager(function () {
			registry.connect({ wsm: webSocketMessager.current, isClient: true });
			registry.promiseSync().then(() => {
				setContent(<React.Fragment>
					<RegistryView registry={registry} />
					<Scene registry={registry} />
				</React.Fragment>);
			});
		});
		return () => {
			registry.onEmplace['Notification'].disconnect(onNotification);
			webSocketMessager.current?.close();
		};
	}, []);

	return <Box className="row grow">
		{content}
		<Snackbar
			open={isSnackbarOpen}
			autoHideDuration={6000}
			onClose={handleClose}
		>
			<Alert
				onClose={handleClose}
				severity={snackbarSeverity}
				variant="filled"
				sx={{ width: '100%' }}
			>
				<pre>
					{snackbarMessage}
				</pre>
			</Alert>
		</Snackbar>
	</Box>
}