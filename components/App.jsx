import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
// import { NetworkedRegistry as NetworkedRegistry } from '@/scripts/NetworkedRegistry';
// import ClientRegistry from '@/scripts/ClientRegistry';
import Registry, { nullEntity } from '@/scripts/Registry';
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
	const [viewedEntity, setViewedEntity] = useState(nullEntity);
	useEffect(function () {
		console.log(`App.useEffect viewedEntity=${viewedEntity}`);
		const registry = Registry()
		const clientSystem = Client({ registry });
		clientSystem.promiseSync().then(() => {
			setContent(<React.Fragment>
				<RegistryView registry={registry} client={clientSystem} viewedEntity={viewedEntity} setViewedEntity={setViewedEntity} />
				<Scene registry={registry} setViewedEntity={setViewedEntity} />
			</React.Fragment>);
		});
		return () => {
			webSocketMessager.current?.close();
			clientSystem.deconstruct();
		};
	}, [viewedEntity]);

	return <Box className="row grow">
		{content}
	</Box>
}