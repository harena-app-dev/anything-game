import * as THREE from 'three'
import Log from '../../Log'
export default function (registry, systems) {
	this.pointer = new THREE.Vector2()
	this.tick = function () {
		Log.info(`Raycaster.tick`, this.pointer);
	}
	this.onPointerMove = function (event) {
		// const offset = sceneElement.getBoundingClientRect();
		// system.pointer.x = ((event.clientX - offset.left) / sceneElement.clientWidth) * 2 - 1;
		// system.pointer.y = -((event.clientY - offset.top) / sceneElement.clientHeight) * 2 + 1;
		this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}
	const onPointerMove = this.onPointerMove.bind(this);
	window.addEventListener('pointermove', onPointerMove);
	this.destructor = function () {
		window.removeEventListener('pointermove', onPointerMove);
	}
}