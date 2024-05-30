export default function ({
	constructors,
	registry,
}) {
	this._systems = {};
	this._registry = registry;
	this.get = function (name) {
		if (this._systems[name] === undefined) {
			const constructor = constructors[name];
			if (constructor === undefined) {
				Log.error(`system ${name} not found`);
				return;
			}
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
		this._systems[name] = new constructor({
			registry,
			systems: this
		});
	}
	for (let [name, system] of Object.entries(this._systems)) {
		system.constructor({
			registry: this._registry,
			systems: this
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

	this.deconstructor = function () {
		for (let [name, system] of Object.entries(this._systems)) {
			if (system.deconstructor === undefined) {
				continue;
			}
			system.deconstructor({
				registry: this._registry,
			});
		}
	}
	return this;
}