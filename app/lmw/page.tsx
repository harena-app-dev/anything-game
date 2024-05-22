'use client'
import * as THREE from 'three';
import Col from '@/components/Col';
import Row from '@/components/Row';
import BackButton from '@/components/BackButton';
// import MouseManager from '@/scripts/MouseManager';
// import FPCamera from '@/scripts/FPCamera';
// import KeyboardState from '@/scripts/KeyboardState';
import React, { useEffect, useRef, useState } from 'react'
import '@/components/common.css';
import WebSocketMessager from '@/scripts/client/WebSocketMessager';


export default function GamePage() {
	const [consoleMessages, setConsoleMessages] = useState<string[]>(["ERROR: No connection to server"]);

	const element = <div className='row grow' >
		<Col flex="1">
			<div className='row'>
				Tree
			</div>
			<div className='row grow'>
			</div>
		</Col>
		<Col flex="1">
			<div className='row'>
				Console
			</div>
			<div className='row grow'>
				{consoleMessages.map((message, index) => <div key={index}>{message}</div>)}
			</div>
			<div className='row'>
				<input className='grow' type="text" />
			</div>
		</Col>
	</div>;
	useEffect(() => {
		const webSocketMessager = new WebSocketMessager(() => {
			webSocketMessager.addHandler('consoleMessages', (messages) => {
				setConsoleMessages(messages);
			});
			console.log('sending');
			webSocketMessager.send('consoleMessages');
		});
		return () => {
		};
	}, []);
	return element;
}
