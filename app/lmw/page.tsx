'use client'
import * as THREE from 'three';
import Col from '@/components/old/Col';
import Row from '@/components/old/Row';
import BackButton from '@/components/old/BackButton';
// import MouseManager from '@/scripts/MouseManager';
// import FPCamera from '@/scripts/FPCamera';
// import KeyboardState from '@/scripts/KeyboardState';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import Button from '@/components/old/Button';
import EntityView from '@/components/EntityView';
import RegistryView from '@/components/RegistryView';
import { createNetworkedRegistry } from '@/scripts/createNetworkedRegistry';

export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState(["ERROR: No connection to server"]);
	// const clientEntityRegistry = useRef<NetworkedRegistry>();
	const webSocketMessager = useRef<WebSocketMessager>();
	const [registry, setRegistry] = useState(createNetworkedRegistry());
	useEffect(function () {
		console.log('useEffect');
		webSocketMessager.current = new WebSocketMessager(function () {
			// clientEntityRegistry.current = new NetworkedRegistry(webSocketMessager.current!);
			registry.connect(webSocketMessager.current!);
			// registry.cmdSync();
			webSocketMessager.current?.addHandler('consoleMessages', (messages) => {
				setConsoleMessages(messages);
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
