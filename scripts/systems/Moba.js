import Log from '../Log.js';
import * as three from 'three';
export default function (registry, systems) {
	this.tick = function () {
		const client = systems.get('Client');
		if (client !== undefined) {
			return;
		}
		registry.view('MoveGoal').each((entity, moveGoal) => {
			const position = registry.get('Position', entity);
			let dx = moveGoal.position.x - position.x;
			let dy = moveGoal.position.y - position.y;
			let dz = moveGoal.position.z - position.z;
			const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
			if (distance < 0.001) {
				return;
				// registry.erase('MoveGoal', entity);
			}
			Log.info(`Moba.tick`, { entity, position, moveGoal, distance });
			dx = dx / distance;
			dy = dy / distance;
			dz = dz / distance;
			const speed = 0.1;
			position.x += dx * Math.min(speed, distance);
			position.y += dy * Math.min(speed, distance);
			position.z += dz * Math.min(speed, distance);
			registry.replace('Position', entity, position);

		});
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, position) {
		Log.info(`Moba.moveTo`, entity, position);
		position.y = 0;
		const moveGoal = registry.getOrEmplace('MoveGoal', entity);
		moveGoal.position = position;
	}
	// this.rpcMoveTo = function (entity, x, y) {
	// 	systems.get('Client').wsm.sendToAll('Moba.moveTo', entity, x, y);
	// }
}