import * as THREE from 'three';
import Log from '../../Log.js';
export default function (registry, systems) {
	registry.onUpdate('MoveGoal', (entity, moveGoal) => {
		Log.info(`MoveGoalRenderer onUpdate`, entity, moveGoal);
		const position = registry.get('Position', entity);
		const points = [];
		points.push(position);
		points.push(moveGoal.position);
		const geometry = new THREE.BufferGeometry().setFromPoints(points);
		const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
		const line = new THREE.Line(geometry, material);
		const renderer = systems.get('Renderer');
		const lineEntity = registry.create();
		renderer.add(lineEntity, line);
	});
	registry.onErase('MoveGoal', (entity, moveGoal) => {
	});
	this.tick = function () {
	}
	this.destructor = function () {
	}
}