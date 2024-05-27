import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import Box from '@mui/material/Box';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import KeyboardState from '@/scripts/client/KeyboardState';
export default function Scene({ registry }) {
	// if (!navigator.gpu) {
	// 	throw new Error("WebGPU not supported on this browser.");
	// } else {
	// 	console.log("WebGPU supported!");
	// }
	useEffect(() => {
		const scene = new THREE.Scene();

		const renderer = new THREE.WebGLRenderer();
		const sceneElement = document.getElementById("scene");
		// renderer.setSize( window.innerWidth, window.innerHeight );
		renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		const camera = new THREE.PerspectiveCamera(75, sceneElement.clientWidth / sceneElement.clientHeight
			, 0.1, 1000);

		sceneElement.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const map = new THREE.TextureLoader().load('images/rogue.png');
		map.magFilter = THREE.NearestFilter;
		map.minFilter = THREE.NearestFilter;
		const material = new THREE.MeshBasicMaterial({ transparent: true, map: map });
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;

		function animate() {
			requestAnimationFrame(animate);

			// cube.rotation.x += 0.01;
			// cube.rotation.y += 0.01;

			renderer.render(scene, camera);
		}

		animate();
	}, []);
	return (
		<Box className="col grow" id="scene">
		</Box>
	);
}