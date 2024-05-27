import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useRef, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import Box from '@mui/material/Box';
import { TextureLoader } from 'three';

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
function Rogue(props) {
	const ref = useRef()
	const colorMap = useLoader(TextureLoader, 'images/hgiU2hA.png')

	useFrame((state, delta) => (ref.current.rotation.z += delta))
	return (
		<mesh
			{...props}
			ref={ref}
		>
			<boxGeometry args={[1, 1, 1]} />
			<meshStandardMaterial map={colorMap} transparent />
		</mesh>
	)
}
export default function Scene({ registry }) {
	// if (!navigator.gpu) {
	// 	throw new Error("WebGPU not supported on this browser.");
	// } else {
	// 	console.log("WebGPU supported!");
	// }
	return (
		<Box className="col grow">
			<Canvas className="">
				<ambientLight intensity={Math.PI / 2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Rogue position={[0, 0, 0]} />
			</Canvas>
		</Box>
	);
}