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
import { GoogleOAuthProvider } from "@react-oauth/google"

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
				{/* <script src="https://apis.google.com/js/platform.js" async defer></script> */}
		{/* <meta name="google-signin-client_id" content="530966030442-u75706pitjlsivadq327gbl35q7gtn7t.apps.googleusercontent.com" /> */}
		<GoogleOAuthProvider clientId='530966030442-u75706pitjlsivadq327gbl35q7gtn7t.apps.googleusercontent.com'>
			<Login />
			{content}
		</GoogleOAuthProvider>
	</Box>
}