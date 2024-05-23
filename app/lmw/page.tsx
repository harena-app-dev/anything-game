'use client'
import * as THREE from 'three';
import Col from '@/components/Col';
import Row from '@/components/Row';
import BackButton from '@/components/BackButton';
// import MouseManager from '@/scripts/MouseManager';
// import FPCamera from '@/scripts/FPCamera';
// import KeyboardState from '@/scripts/KeyboardState';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import WebSocketMessager from '@/scripts/client/WebSocketMessager';
import Button from '@/components/Button';


export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState(["ERROR: No connection to server"]);
	const webSocketMessager = useRef<WebSocketMessager>();
	useEffect(function () {
		console.log('useEffect');
		webSocketMessager.current = new WebSocketMessager(function () {
			webSocketMessager.current?.addHandler('consoleMessages', (messages) => {
				setConsoleMessages(messages);
			});
			webSocketMessager.current?.addHandler('newMessage', (message) => {
				setConsoleMessages(prev => prev.concat([message]));

			});
			webSocketMessager.current?.send('consoleMessages');
			webSocketMessager.current?.send('loadEntities');
		});
		return () => {
			webSocketMessager.current?.close();
		};
	}, []);
	return <div className='row grow' >
		<Col flex="1">
			<div className='row title'>
				Entities
			</div>
			<div className='col grow'>
				<div className='row button' onClick={() => {
					webSocketMessager.current?.send('createEntity');
				}}>
					+
				</div>
			</div>
		</Col>
		<Col flex="1">
			<div className='row title'>
				Console
			</div>
			<div className='col grow'>
				{consoleMessages.map((message, index) => <div className='row' key={index}>{message}</div>)}
			</div>
			<div className='row'>
				<input className='grow' type="text" />
			</div>
		</Col>
	</div>;
}
