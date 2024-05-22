'use client'

import { useEffect } from 'react';
import * as THREE from 'three';

export default class MouseManager {
	#deltaMousePosition = new THREE.Vector2();

	getDeltaMousePosition() {
		return this.#deltaMousePosition.clone();
	}

	#shouldLockCursor = false;

	update() {
		this.#deltaMousePosition.set(0, 0);
	}

	lockCursor(document: Document) {
		this.#shouldLockCursor = true;
		document.body.requestPointerLock();
	}

	unlockCursor(document: Document) {
		this.#shouldLockCursor = false;
		document.exitPointerLock();
	}

	onDocumentMouseMove(event: MouseEvent) {
		event.preventDefault();
		this.#deltaMousePosition.x += event.movementX;
		this.#deltaMousePosition.y += event.movementY;
	}

	constructor(document: Document) {
		document.body.addEventListener(
			'mousemove',
			this.onDocumentMouseMove.bind(this),
			false,
		);
		document.body.addEventListener('click', async () => {
			if (this.#shouldLockCursor) {
				document.body.requestPointerLock();
			}
		});

	}
}
