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
	const webSocketMessager = useRef();
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	useEffect(function () {
		Log.debug(`App.useEffect`);
		const registry = Registry()
		const systems = new Systems({
			constructors: { ...commonSystems, ...clientSystems },
			registry,
		});
		systems.get("Client").promiseSync().then(() => {
			setContent(<React.Fragment>
				<Scene registry={registry} systems={systems} />
			</React.Fragment>);
		});
		return () => {
			webSocketMessager.current?.close()
			systems.destructor()
		};
	}, []);

	return <Box className="row grow">
		<Login />
		{content}
	</Box>
}