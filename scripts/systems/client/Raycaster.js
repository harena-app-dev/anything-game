import * as THREE from 'three'
export default function (registry, systems) {
	this.raycaster = new THREE.Raycaster()
	this.tick = function () {
		const renderer = systems.get('Renderer')
		const mouse = systems.get('Mouse')
		this.raycaster.setFromCamera(mouse.pointer, renderer.camera);
	}
	this.destructor = function () {
	}
}