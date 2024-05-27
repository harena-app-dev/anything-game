import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import { Stack } from "@mui/material";
import { createRoot } from 'react-dom/client'
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props) {
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
	if (!navigator.gpu) {
		throw new Error("WebGPU not supported on this browser.");
	} else {
		console.log("WebGPU supported!");
	}
	return (
		<Accordion defaultExpanded className="col grow">
			<AccordionSummary
				expandIcon={<ExpandMoreIcon />}
				aria-controls="panel1-content"
				id="panel1-header"
			>
				Scene
			</AccordionSummary>
			<AccordionDetails className="col grow">
				<Canvas className="">
					<ambientLight intensity={Math.PI / 2} />
					<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
					<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
					<Box position={[-1.2, 0, 0]} />
					<Box position={[1.2, 0, 0]} />
				</Canvas>
			</AccordionDetails>
		</Accordion>
	);
}