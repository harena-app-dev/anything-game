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
import ClientRegistry from '@/scripts/client/ClientRegistry';
import Button from '@/components/old/Button';
import Registry from '@/scripts/Registry';
import EntityView from '@/components/EntityView';
import RegistryView from '@/components/RegistryView';


export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState(["ERROR: No connection to server"]);
	// const clientEntityRegistry = useRef<ClientRegistry>();
	const webSocketMessager = useRef<WebSocketMessager>();
	const [registry, setRegistry] = useState(new ClientRegistry());
	useEffect(function () {
		console.log('useEffect');
		webSocketMessager.current = new WebSocketMessager(function () {
			// clientEntityRegistry.current = new ClientRegistry(webSocketMessager.current!);
			registry.connect(webSocketMessager.current!);
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
	var entityElements: JSX.Element[] = [];
	registry.each((id, data) => {
		entityElements.push(<EntityView key={id} entity={id} registry={registry} />);
	});
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
