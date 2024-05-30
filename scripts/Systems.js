import Log from './Log.js';
export default function ({
	constructors,
	registry,
}) {
	Log.debug(`Systems`);
	this._systems = {};
	this._registry = registry;
	this.get = function (name) {
		if (this._systems[name] === undefined) {
			const constructor = constructors[name];
			if (constructor === undefined) {
				Log.error(`system ${name} not found`);
				return;
			}
			Log.info(`get-constructing system ${name}`);
			this._systems[name] = new constructor({
				registry: this._registry,
				systems: this
			});
		}
		return this._systems[name];
	}
	for (let [name, constructor] of Object.entries(constructors)) {
		if (this._systems[name] !== undefined) {
			continue;
		}
		Log.info(`constructing system ${name}`);
		this._systems[name] = new constructor({
			registry,
			systems: this
		});
		Log.debug(`end constructing ${name}`);
	}
	this.tick = function () {
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.tick === undefined) {
				continue;
			}
			system.tick({
				registry: this._registry,
				systemGraph: this,
			});
		}
	}

	this.destructor = function () {
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.destructor === undefined) {
				continue;
			}
			system.destructor({
				registry: this._registry,
			});
		}
	}
	Log.debug(`Systems end`);
	return this;
}