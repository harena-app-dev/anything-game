'use client'
import * as THREE from 'three';
import Col from '@/components/Col';
import Row from '@/components/Row';
import BackButton from '@/components/BackButton';
// import MouseManager from '@/scripts/MouseManager';
// import FPCamera from '@/scripts/FPCamera';
// import KeyboardState from '@/scripts/KeyboardState';
import React, { useRef, useState } from 'react'
import '@/components/common.css';
import WebSocketMessager from '@/scripts/client/WebSocketMessager';

const webSocketMessager = new WebSocketMessager();

export default function GamePage() { 


	return <div className='row grow' >
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
				<div className='col grow'>
				</div>
			</div>
			<div className='row'>
				<input className='grow' type="text" />
			</div>
		</Col>
	</div>;
}
