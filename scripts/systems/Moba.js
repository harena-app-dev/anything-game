import Log from '../Log.js';
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
			dx = dx / distance;
			dy = dy / distance;
			dz = dz / distance;
			const speed = 0.1;
			position.x += dx * speed;
			position.y += dy * speed;
			position.z += dz * speed;
			registry.replace('Position', entity, position);
			if (distance < 0.1) {
				registry.erase('MoveGoal', entity);
			}

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