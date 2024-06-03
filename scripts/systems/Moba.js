import Log from '../Log.js';
import * as THREE from 'three';
export default function (registry, systems) {
	this.tick = function () {
		const client = systems.get('Client');
		if (client !== undefined) {
			return;
		}
		registry.view('MoveGoal').each((entity, moveGoal) => {
			const goalPosition = moveGoal.position;
			const objectPosition = registry.get('Position', entity);
			// let dx = moveGoal.position.x - position.x;
			// let dy = moveGoal.position.y - position.y;
			// let dz = moveGoal.position.z - position.z;
			// const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
			const distance = objectPosition.distanceTo(goalPosition);
			Log.info(`Moba.tick`, { goalEntity: entity, goalPosition, objectPosition, distance });
			if (distance < 0.001) {
				registry.erase('MoveGoal', entity);
				return;
			}
			// Log.info(`Moba.tick`, { goalEntity, goalPosition, moveGoal, distance });
			const direction = goalPosition.clone().sub(objectPosition).normalize();
			const speed = Math.min(distance, 0.1);
			const delta = direction.clone().multiplyScalar(speed);
			objectPosition.add(delta);
			// registry.replace('Position', moveGoal.entity, objectPosition);
			registry.replace('Position', entity, objectPosition);

		});
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, _position) {
		// copy _position
		Log.info(`Moba.moveTo`, entity, _position);
		const position = new THREE.Vector3();
		position.y = 0;
		position.x = _position.x;
		position.z = _position.z;
		// const goalEntity = registry.create();
		// const goal = registry.emplace('MoveGoal', goalEntity, { entity });
		const goal = registry.emplaceOrReplace('MoveGoal', entity, { position });
	}
}