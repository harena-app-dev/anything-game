export default function SystemGraph({
	constructors,
	registry,
}) {
	this._systems = {};
	for (let [name, constructor] of Object.entries(constructors)) {
		if (this._systems[name] !== undefined) {
			Log.error(`SystemGraph: duplicate system name ${name}`);
			continue;
		}
		this._systems[name] = new constructor({
			registry,
		});
	}
	this._registry = registry;
	for (let [name, system] of Object.entries(this._systems)) {
		system.constructor({
			registry: this._registry,
		});
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
	this.get = function (name) {
		return this._systems[name];
	}
	this.deconstructor = function () {
		for (let [name, system] of Object.entries(this._systems)) {
			system.deconstructor({
				registry: this._registry,
			});
		}
	}
	return this;
}