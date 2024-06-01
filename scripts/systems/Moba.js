export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, x, y) {
		Log.info(`Moba.moveTo`, entity, x, y);
		const moveGoal = registry.get(entity, 'MoveGoal');
		if (moveGoal) {
			moveGoal.x = x;
			moveGoal.y = y;
		} else {
			registry.emplace(entity, 'MoveGoal', { x, y });
		}
	}
	// this.rpcMoveTo = function (entity, x, y) {
	// 	systems.get('Client').wsm.sendToAll('Moba.moveTo', entity, x, y);
	// }
}