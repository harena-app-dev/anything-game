import React, { useEffect, useRef, useState } from 'react'
import Registry from '@/scripts/Registry';
import Box from '@mui/material/Box';
import Scene from './Scene';
import * as commonSystems from '@/scripts/systems/index.auto.js';
import * as clientSystems from '@/scripts/systems/client/index.auto.js';
import Systems from '@/scripts/Systems';
import { CircularProgress } from '@mui/material';
import Log from '@/scripts/Log';
export default function App() {
	const webSocketMessager = useRef();
	// const [registry, setRegistry] = useState(NetworkedRegistry());
	// const [registry, setRegistry] = useState(ClientRegistry());
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	// const [viewedEntity, setViewedEntity] = useState(nullEntity);
	useEffect(function () {
		Log.debug(`App.useEffect`);
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
			webSocketMessager.current?.close()
			systems.destructor()
		};
	}, []);

	return <Box className="row grow">
		{content}
	</Box>
}