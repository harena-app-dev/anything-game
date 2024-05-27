import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Box from '@mui/material/Box';

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
export default function Scene({ registry }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
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
				<ThreeBox position={[-1.2, 0, 0]} />
				<ThreeBox position={[1.2, 0, 0]} />
			</Canvas>
		</Box>
	);
}