import Log from '../../Log';
import * as THREE from 'three';
import { nullEntity } from '../../Registry';
export default function ({ registry, sceneElement, spriteRenderer, scene }) {
	const system = {
		raycaster: new THREE.Raycaster(),
		pointer: new THREE.Vector2(),
		onRender({ camera }) {
			this.raycaster.setFromCamera(this.pointer, camera);
		}
	}
	registry.onEmplace({
		type: 'Selection', callback: (entity) => {
			const sprite = registry.emplace({ entity, type: 'Sprite', component: { path: 'selectionSquare.png' } });
			const selection = registry.get(entity, 'Selection');
			const parent = registry.emplace({ entity, type: 'Parent', component: { entity: selection.entity } });
		}
	});
	function onPointerMove(event) {
		const offset = sceneElement.getBoundingClientRect();
		system.pointer.x = ((event.clientX - offset.left) / sceneElement.clientWidth) * 2 - 1;
		system.pointer.y = -((event.clientY - offset.top) / sceneElement.clientHeight) * 2 + 1;
	}
	window.addEventListener('pointermove', onPointerMove);
	function onPointerDown(event) {
		const intersects = system.raycaster.intersectObjects(scene.children);
		if (intersects.length > 0) {
			const entity = spriteRenderer.getEntityFromThree(intersects[0].object.id);
			// setViewedEntity(entity);
			const selectionEntity = registry.create();
			registry.emplace({ type: 'Selection', entity: selectionEntity, component: { entity } });
		} else {
			registry.each({
				types: ['Selection'], callback: (entity) => {
					console.log('destroying selection entity', entity);
					registry.destroy(entity);
				}
			});
		}
	}
	window.addEventListener('pointerdown', onPointerDown);
	return system
}