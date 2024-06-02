import React, { useEffect, useRef, useState } from 'react'
import Registry from '@/scripts/Registry';
import Box from '@mui/material/Box';
import Scene from './Scene';
import * as commonSystems from '@/scripts/systems/index.auto.js';
import * as clientSystems from '@/scripts/systems/client/index.auto.js';
import Systems from '@/scripts/Systems';
import { CircularProgress } from '@mui/material';
import Log from '@/scripts/Log';
import Login from './Login';
export default function App() {
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	// const registry = Registry()
	const registryRef = useRef(Registry());
	// const systems = new Systems({
	const systemsRef = useRef(new Systems({
		constructors: { ...commonSystems, ...clientSystems },
		// registry,
		registry: registryRef.current
	}));
	useEffect(function () {
		Log.debug(`App.useEffect`);

		const client = systemsRef.current.get("Client");
		const app = { registry: registryRef.current, systems: systemsRef.current };
		client.promiseConnect().then(() => {
			client.promiseSync().then(() => {
				setContent(<React.Fragment>
					<Login registry={registryRef.current} systems={systemsRef.current} />
					<Scene app={app}/>
				</React.Fragment>);
			});
		});
		return () => {
			// systems.destructor()
		};
	}, []);

	return <Box className="row grow">
		{content}
	</Box>
}