import { nullEntity } from '@/scripts/Core'
import * as THREE from 'three'
import Log from '@/scripts/Log'
export default function (registry, systems) {
	this.raycaster = new THREE.Raycaster()
	this.tick = function () {
		const renderer = systems.get('Renderer')
		const mouse = systems.get('Mouse')
		this.raycaster.setFromCamera(mouse.pointer, renderer.camera);
		Log.info(`mouse.pointer`, mouse.pointer);
		Log.info(`Raycaster.raycastFromCursor`, this.raycastFromCursor());
		Log.info(`Raycaster.raycastFromCursor types`, registry.getTypes(this.raycastFromCursor()));
	}
	this.destructor = function () {
	}
	const renderer = systems.get('Renderer')
	this.raycastFromCursor = function () {
		const intersects = this.raycaster.intersectObjects(renderer.getScene().children);
		Log.info(`Raycaster.raycastFromCursor`, intersects);
		if (intersects.length > 0) {
			return renderer.t2e(intersects[intersects.length - 1].object);
		}
		return nullEntity;
	}
}