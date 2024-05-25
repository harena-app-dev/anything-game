'use client'
import React, { useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import RegistryView from '@/components/RegistryView';
import { createNetworkedRegistry } from '@/scripts/createNetworkedRegistry';

export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState(["ERROR: No connection to server"]);
	const webSocketMessager = useRef<WebSocketMessager>();
	const [registry, setRegistry] = useState(createNetworkedRegistry());
	useEffect(function () {
		webSocketMessager.current = new WebSocketMessager(function () {
			registry.connect({ wsm: webSocketMessager.current!, isClient: true });
			webSocketMessager.current?.addHandler('consoleMessages', ({ws, args}) => {
				setConsoleMessages(args);
			});
			webSocketMessager.current?.addHandler('newMessage', (message) => {
				setConsoleMessages(prev => prev.concat([message]));
			});
			webSocketMessager.current?.send('consoleMessages');
		});
		return () => {
			webSocketMessager.current?.close();
		};
	}, []);
	return <div className='row grow' >
		<RegistryView registry={registry} />
		<div className='col grow' >
			<div className='row title'>
				Console
			</div>
			<div className='col grow ui'>
				{consoleMessages.map((message, index) => <div className='row' key={index}>{message}</div>)}
			</div>
			<div className='row'>
				<input className='grow' type="text" />
			</div>
		</div>
	</div>
}
