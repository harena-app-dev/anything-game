import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
// import { NetworkedRegistry as NetworkedRegistry } from '@/scripts/NetworkedRegistry';
// import ClientRegistry from '@/scripts/ClientRegistry';
import Registry from '@/scripts/Registry';
import RegistryView from '@/components/ecs/RegistryView';
import Client from '@/scripts/systems/Client';
import Box from '@mui/material/Box';
import Scene from './Scene';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
export default function App() {
	const webSocketMessager = useRef();
	// const [registry, setRegistry] = useState(NetworkedRegistry());
	// const [registry, setRegistry] = useState(ClientRegistry());
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
		const registry = Registry()
		registry.onEmplace['Notification'].connect(onNotification);
		const clientSystem = Client({ registry });
		clientSystem.promiseSync().then(() => {
			setContent(<React.Fragment>
				<RegistryView registry={registry} client={clientSystem} />
				<Scene registry={registry} />
			</React.Fragment>);
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