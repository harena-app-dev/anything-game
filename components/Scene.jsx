import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import Box from '@mui/material/Box';
import { TextureLoader } from 'three';
import * as THREE from 'three';
import KeyboardState from '@/scripts/client/KeyboardState';

function ThreeBox(props) {
	// This reference gives us direct access to the THREE.Mesh object
	const ref = useRef()
	// Hold state for hovered and clicked events
	const [hovered, hover] = useState(false)
	const [clicked, click] = useState(false)
	// Subscribe this component to the render-loop, rotate the mesh every frame
	useFrame((state, delta) => (ref.current.rotation.x += delta))
	// Return the view, these are regular Threejs elements expressed in JSX
	return (
		<mesh
			{...props}
			ref={ref}
			scale={clicked ? 1.5 : 1}
			onClick={(event) => click(!clicked)}
			onPointerOver={(event) => hover(true)}
			onPointerOut={(event) => hover(false)}>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
		</mesh>
	)
}
function Sprite(props) {
	const ref = useRef()
	const { spritePath, scale } = props
	const colorMap = useLoader(TextureLoader, `images/${spritePath}`)
	colorMap.magFilter = THREE.NearestFilter;
	colorMap.minFilter = THREE.NearestFilter;
	return (
		<mesh
			{...props}
			ref={ref}
		>
			<boxGeometry args={scale === undefined ? [1, 1, 1] : scale} />
			<meshStandardMaterial map={colorMap} transparent />
		</mesh>
	)
}
const keyState = new KeyboardState()

function Rogue(props) {
	const ref = useRef()
	useFrame((state, delta) => {
		if (keyState.isKeyDown("q")) {
			ref.current.position.z += 0.01;
		} 
		if (keyState.isKeyDown("e")) {
			ref.current.position.z -= 0.01;
		}
	})
	return (
		<mesh
			{...props}
			ref={ref}
		>
			<Sprite {...props} spritePath={"rogue.png"}/>
		</mesh>
	)
}
export default function Scene({ registry }) {
	// if (!navigator.gpu) {
	// 	throw new Error("WebGPU not supported on this browser.");
	// } else {
	// 	console.log("WebGPU supported!");
	// }
	const terrainSprites = [];
	for (let x = -10; x < 10; x++) {
		for (let y = -10; y < 10; y++) {
			terrainSprites.push(<Sprite key={`terrain-${x}-${y}`} position={[x, y, 0]} spritePath={"grass.png"} scale={[1, 1, 1]} />)
		}
	}


	return (
		<Box className="col grow">
			<Canvas className="">
				<ambientLight intensity={Math.PI / 2} />
				{/* <spotLight position={[0, 0, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} /> */}
				<pointLight position={[0, 0, 1]} decay={0} intensity={1} />
				<Rogue position={[0, 0, 0.01]} />
				{terrainSprites}
			</Canvas>
		</Box>
	);
}