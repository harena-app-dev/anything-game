import { nullEntity } from '@/scripts/Registry.js';
import Log from '../../Log.js';
export default function (registry, systems) {
	this._playerEntity = nullEntity;
	this.tick = function () {
		Log.debug('Player.tick');
		if (!registry.valid(this._playerEntity)) {
			return;
		}
		const keyboard = systems.get('Keyboard');
		const x = keyboard.isKeyDown('d') - keyboard.isKeyDown('a');
		const y = keyboard.isKeyDown('s') - keyboard.isKeyDown('w');
		Log.debug('Player.tick', x, y);
		const position = registry.get('Position', this._playerEntity);
		position.x += x;
		position.y += y;
		Log.debug('player', position);

	}
	this.destructor = function () {
	}
	const client = systems.get('Client');
	client.promiseCreate().then((entity) => {
		Log.debug('promiseCreate', entity);

		// client.promiseEmplace({ entity, type: 'Spawner' });
		client.promiseEmplace("Sprite", entity, { path: "rogue.png" }).then(() => {
			this._playerEntity = entity;
		})
	});
}