import Log from '../../Log.js';
export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	const client = systems.get('Client');
	client.promiseCreate().then((entity) => {
		Log.debug('promiseCreate', entity);
		// client.promiseEmplace({ entity, type: 'Spawner' });
		client.promiseEmplace("Sprite", entity, { path: "rogue.png" });
	});
}