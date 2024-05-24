'use client'
import * as THREE from 'three';
import Col from '@/components/old/Col';
import Row from '@/components/old/Row';
import BackButton from '@/components/old/BackButton';
// import MouseManager from '@/scripts/MouseManager';
// import FPCamera from '@/scripts/FPCamera';
// import KeyboardState from '@/scripts/KeyboardState';
import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'

function Box(props: any) {
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
export default function GamePage() {
	// const renderer = new THREE.WebGLRenderer({ antialias: true });
	// useEffect(() => {
	// const mouseManager = new MouseManager(document);
	// mouseManager.lockCursor(document);

	// const scene = new THREE.Scene();

	// const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
	// geometry.translate(0, 0, -1);
	// const meshNormalMaterial = new THREE.MeshNormalMaterial();

	// const mesh = new THREE.Mesh(geometry, meshNormalMaterial);
	// scene.add(mesh);

	//   const map = new THREE.TextureLoader().load('features-03-image-01.png');
	//   const material = new THREE.SpriteMaterial({ map });

	//   const sprite = new THREE.Sprite(material);
	//   scene.add(sprite);

	// renderer.setSize(window.innerWidth, window.innerHeight);
	// window.addEventListener('resize', () => {
	// 	renderer.setSize(window.innerWidth, window.innerHeight);
	// });

	// const fPCamera = new FPCamera(window);
	// const keyboardState = new KeyboardState();
	// function animation(time: number) {
	// 	renderer.render(scene, fPCamera.camera);

	// 	const mouseDelta = mouseManager.getDeltaMousePosition();
	// 	mouseDelta.x *= -1;
	// 	mouseDelta.y *= -1;
	// 	mouseDelta.multiplyScalar(THREE.MathUtils.DEG2RAD);
	// 	fPCamera.rotate(mouseDelta);
	// 	fPCamera.move(
	// 		new THREE.Vector3(
	// 			keyboardState.isKeyDown('d') - keyboardState.isKeyDown('a'),
	// 			keyboardState.isKeyDown(' ') - keyboardState.isKeyDown('Shift'),
	// 			0 - keyboardState.isKeyDown('s') + keyboardState.isKeyDown('w'),
	// 		),
	// 	);
	// 	mouseManager.update();
	// }
	// renderer.setAnimationLoop(animation);
	// renderer.domElement.style.position = 'absolute';
	// renderer.domElement.style.top = '0';
	// renderer.domElement.style.left = '0';
	// renderer.domElement.style.zIndex = '-1';
	// }, []);
	return (
		<Col>
			<Row>
				<BackButton />
			</Row>
			<Canvas>
				<ambientLight intensity={Math.PI / 2} />
				<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
				<pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
				<Box position={[-1.2, 0, 0]} />
				<Box position={[1.2, 0, 0]} />
			</Canvas>,
			{/* <div ref={(ref) => ref?.appendChild(renderer.domElement)} /> */}
		</Col>
	);
}
