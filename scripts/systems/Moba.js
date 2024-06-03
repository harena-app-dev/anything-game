import Log from '../Log.js';
import * as three from 'three';
export default function (registry, systems) {
	this.tick = function () {
		const client = systems.get('Client');
		if (client !== undefined) {
			return;
		}
		registry.view('MoveGoal').each((goalEntity, moveGoal) => {
			const goalPosition = registry.get('Position', goalEntity);
			const objectPosition = registry.get('Position', moveGoal.entity);
			// let dx = moveGoal.position.x - position.x;
			// let dy = moveGoal.position.y - position.y;
			// let dz = moveGoal.position.z - position.z;
			// const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
			const distance = objectPosition.distanceTo(goalPosition);
			Log.info(`Moba.tick`, { goalEntity, goalPosition, objectPosition, distance });
			if (distance < 0.001) {
				registry.erase('MoveGoal', goalEntity);
				return;
			}
			Log.info(`Moba.tick`, { goalEntity, goalPosition, moveGoal, distance });
			const direction = goalPosition.clone().sub(objectPosition).normalize();
			const speed = Math.min(distance, 0.1);
			const delta = direction.clone().multiplyScalar(speed);
			objectPosition.add(delta);
			registry.replace('Position', moveGoal.entity, objectPosition);

		});
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, _position) {
		// copy _position
		Log.info(`Moba.moveTo`, entity, _position);
		const position = { ..._position };
		position.y = 0;
		const goalEntity = registry.create();
		const goal = registry.emplace('MoveGoal', goalEntity, { entity });
		const goalPosition = registry.emplace('Position', goalEntity, position);
	}
}