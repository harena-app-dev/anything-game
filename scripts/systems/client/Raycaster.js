import { nullEntity } from '@/scripts/Core'
import * as THREE from 'three'
import Log from '@/scripts/Log'
export default function (registry, systems) {
	this.raycaster = new THREE.Raycaster()
	this.tick = function () {
		const renderer = systems.get('Renderer')
		const mouse = systems.get('Mouse')
		this.raycaster.setFromCamera(mouse.pointer, renderer.camera);
		Log.debug(`mouse.pointer`, mouse.pointer);
		Log.debug(`Raycaster.raycastFromCursor`, this.raycastFromCursor());
		Log.debug(`Raycaster.raycastFromCursor types`, registry.getTypes(this.raycastFromCursor()));
	}
	this.destructor = function () {
	}
	const renderer = systems.get('Renderer')
	this.raycastFromCursor = function () {
		const intersects = this.raycaster.intersectObjects(renderer.getScene().children);
		Log.info(`num intersects`, intersects.length);
		if (intersects.length > 0) {
			for (let i = 0; i < intersects.length; i++) {
				const entity = renderer.t2e(intersects[i].object.id);
				Log.info(entity, registry.getTypes(entity));
			}
			return renderer.t2e(intersects[0].object.id);
		}
		return nullEntity;
	}
}