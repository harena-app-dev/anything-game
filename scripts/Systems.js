import Log from './log.js';
export default function ({
	constructors,
	registry,
}) {
	Log.debug(`Systems constructor`);
	this._systems = {};
	this.each = function (callback) {
		for (let [name, system] of Object.entries(this._systems)) {
			callback(name, system);
		}
	}
	this._registry = registry;
	this.get = function (name) {
		if (this._systems[name] === undefined) {
			const constructor = constructors[name];
			if (constructor === undefined) {
				return undefined;
			}
			Log.debug(`get-constructing system ${name}`);
			this._systems[name] = new constructor(registry, this);
		}
		return this._systems[name];
	}
	for (const name of Object.keys(constructors)) {
		this.get(name);
	}
	for (const system of Object.values(this._systems)) {
		if (system.onSystemsReady === undefined) {
			continue;
		}
		system.onSystemsReady();
	}
	let tickCount = 0;
	this.tick = function () {
		Log.debug(`Systems.tick start`, tickCount++);
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.tick === undefined) {
				continue;
			}
			system.tick();
		}
		// Log.debug(`Systems.tick end`);
	}

	this.destructor = function () {
		Log.debug(`Systems destructor`);
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