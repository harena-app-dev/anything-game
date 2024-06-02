import { nullEntity } from '@/scripts/Core'
import * as THREE from 'three'
import Log from '@/scripts/Log'
export default function (registry, systems) {
	this.raycaster = new THREE.Raycaster()
	this.tick = function () {

	}
	this.destructor = function () {
	}
	const renderer = systems.get('Renderer')
	this.getCursorIntersection = function () {
		const renderer = systems.get('Renderer')
		const mouse = systems.get('Mouse')
		this.raycaster.setFromCamera(mouse.pointer, renderer.camera);
		const intersects = this.raycaster.intersectObjects(renderer.getScene().children);
		if (intersects.length > 0) {
			const worldPosition = intersects[0].point;
			Log.info(`Raycaster.getCursorIntersection`, intersects[0].object.id, worldPosition);
			const entity = renderer.t2e(intersects[0].object.id);
			return { entity, worldPosition };
		}
		return {};
	}
}