export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, x, y) {
		Log.debug(`Moba.moveTo`, entity, x, y);
		const moveGoal = registry.getOrEmplace(entity, 'MoveGoal');
		moveGoal.x = x;
		moveGoal.y = y;
	}
	// this.rpcMoveTo = function (entity, x, y) {
	// 	systems.get('Client').wsm.sendToAll('Moba.moveTo', entity, x, y);
	// }
}