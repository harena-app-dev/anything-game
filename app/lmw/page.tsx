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

export default function GamePage() {
	return (
		<div className='row grow' >
			<Col flex="1">Tree</Col>
			<Col flex="1">
				<div className='row grow'>
					<div className='col grow'>
						Messages
					</div>
				</div>
				<div className='row'>
					<input className='grow' type="text" />
				</div>
			</Col>
		</div>
	);
}
