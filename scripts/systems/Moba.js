import Log from '../Log.js';
export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	this.moveTo = function (entity, position) {
		Log.info(`Moba.moveTo`, entity, position);
		const moveGoal = registry.getOrEmplace('MoveGoal', entity);
		moveGoal.position = position;
	}
	// this.rpcMoveTo = function (entity, x, y) {
	// 	systems.get('Client').wsm.sendToAll('Moba.moveTo', entity, x, y);
	// }
}