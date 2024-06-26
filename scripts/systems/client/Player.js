import { nullEntity } from '@/scripts/Core.js';
import Log from '../../log.js';
export default function (registry, systems) {
	this._playerEntity = nullEntity;
	this.tick = function () {
		Log.debug(`Player.tick`, this._playerEntity);
		if (!registry.valid(this._playerEntity)) {
			return;
		}
		const keyboard = systems.get('Keyboard');
		const x = keyboard.isKeyDown('d') - keyboard.isKeyDown('a');
		const z = keyboard.isKeyDown('s') - keyboard.isKeyDown('w');
		const position = registry.get('Position', this._playerEntity);
		position.x += x * 0.1;
		position.z += z * 0.1;
		Log.debug(`Player.tick`, position);
		registry.replace('Position', this._playerEntity, position);

	}
	this.setPlayerEntity = function (entity) {
		Log.debug(`Player.setPlayerEntity`, entity);
		this._playerEntity = entity;
	}
	this.getPlayerEntity = function () {
		return this._playerEntity;
	}
	this.destructor = function () {
	}
}