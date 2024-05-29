'use client'

import * as THREE from 'three';

export default function MouseManager() {
	const sys = {
		deltaMousePosition : new THREE.Vector2(),
		getDeltaMousePosition() {
			return this.deltaMousePosition.clone()
		},
		shouldLockCursor: false,
		update() {
			this.deltaMousePosition.set(0, 0)
		},
		lockCursor() {
			this.shouldLockCursor = true,
				document.body.requestPointerLock()
		},

		unlockCursor() {
			this.shouldLockCursor = false;
			document.exitPointerLock();
		},

		onDocumentMouseMove(event) {
			event.preventDefault();
			this.deltaMousePosition.x += event.movementX;
			this.deltaMousePosition.y += event.movementY;
		},
	}
	document.body.addEventListener(
		'mousemove',
		sys.onDocumentMouseMove.bind(sys),
		false,
	);
	document.body.addEventListener('click', async () => {
		if (sys.shouldLockCursor) {
			document.body.requestPointerLock();
		}
	});
	return sys;
}
