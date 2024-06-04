import React, { useEffect, useRef, useState } from 'react'
import Registry from '@/scripts/Registry';
import Box from '@mui/material/Box';
import Scene from './Scene';
import * as commonSystems from '@/scripts/systems/index.auto.js';
import * as clientSystems from '@/scripts/systems/client/index.auto.js';
import Systems from '@/scripts/Systems';
import { CircularProgress, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Log from '@/scripts/log';
import Login from './Login';
export default function App() {
	const [content, setContent] = useState(<CircularProgress sx={{ margin: 'auto' }} />);
	const [theme, setTheme] = useState(createTheme({
		palette: {
			mode: 'dark',
		},
	}));
	
	const registryRef = useRef();
	const systemsRef = useRef();
	useEffect(function () {
		Log.debug(`App.useEffect`);
		registryRef.current = Registry();
		systemsRef.current = new Systems({
			constructors: { ...commonSystems, ...clientSystems },
			registry: registryRef.current
		});
		const client = systemsRef.current.get("Client");
		const app = {
			registryRef, systemsRef, theme, setTheme,
			get() {
				return [registryRef.current, systemsRef.current];
			}
		};
		client.promiseConnect().then(() => {
			client.promiseSync().then(() => {
				setContent(<React.Fragment>
					<Login app={app} />
					<Scene app={app} />
				</React.Fragment>);
			});
		});
		return () => {
			// systems.destructor()
		};
	}, []);

	// return <Box className="row grow">
	// 	{content}
	// </Box>
	return <ThemeProvider theme={theme}>
		<CssBaseline />
		{/* <App /> */}
		{content}
	</ThemeProvider>
}