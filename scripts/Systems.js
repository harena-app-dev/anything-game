import Log from './Log.js';
export default function ({
	constructors,
	registry,
}) {
	Log.info(`Systems constructor`);
	this._systems = {};
	this._registry = registry;
	this.get = function (name) {
		if (this._systems[name] === undefined) {
			const constructor = constructors[name];
			if (constructor === undefined) {
				Log.error(`system ${name} not found`);
				return;
			}
			Log.debug(`get-constructing system ${name}`);
			this._systems[name] = new constructor(registry, this);
		}
		return this._systems[name];
	}
	for (let [name, constructor] of Object.entries(constructors)) {
		if (this._systems[name] !== undefined) {
			continue;
		}
		Log.debug(`constructing system ${name}`);
		this._systems[name] = new constructor(registry, this);
		Log.debug(`end constructing ${name}`);
	}
	this.tick = function () {
		// Log.info(`Systems.tick`);
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.tick === undefined) {
				continue;
			}
			system.tick();
		}
		// Log.info(`Systems.tick end`);
	}

	this.destructor = function () {
		Log.info(`Systems destructor`);
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.destructor === undefined) {
				continue;
			}
			system.destructor();
		}
	}
	Log.debug(`Systems end`);
	return this;
}