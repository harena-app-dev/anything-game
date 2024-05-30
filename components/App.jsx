import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
// import { NetworkedRegistry as NetworkedRegistry } from '@/scripts/NetworkedRegistry';
// import ClientRegistry from '@/scripts/ClientRegistry';
import Registry, { nullEntity } from '@/scripts/Registry';
import RegistryView from '@/components/ecs/RegistryView';
import Client from '@/scripts/systems/client/Client';
import Box from '@mui/material/Box';
import Scene from './Scene';
import * as commonSystems from '@/scripts/systems/index.auto.js';
import * as clientSystems from '@/scripts/systems/client/index.auto.js';
import Systems from '@/scripts/Systems';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
export default function App() {
	const webSocketMessager = useRef();
	// const [registry, setRegistry] = useState(NetworkedRegistry());
	// const [registry, setRegistry] = useState(ClientRegistry());
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	// const [viewedEntity, setViewedEntity] = useState(nullEntity);
	useEffect(function () {
		const registry = Registry()
		const systems = new Systems({
			constructors: { ...commonSystems, ...clientSystems },
			registry,
		});
		// const clientSystem = Client({ registry });
		// clientSystem.promiseSync().then(() => {
		systems.get("Client").promiseSync().then(() => {
			setContent(<React.Fragment>
				{/* <RegistryView registry={registry} client={clientSystem} viewedEntity={viewedEntity} setViewedEntity={setViewedEntity} /> */}
				<Scene registry={registry} />
			</React.Fragment>);
		});
		return () => {
			webSocketMessager.current?.close();
			// clientSystem.deconstruct();
		};
	});

	return <Box className="row grow">
		{content}
	</Box>
}