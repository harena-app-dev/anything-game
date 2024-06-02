export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	const wsm = systems.get('Wsm').getWsm();
	this._addRpc = function (name, system) {
		const rpcs = {};
		for (let [fieldName, field] of Object.entries(system)) {
			if (typeof field !== 'function') {
				continue;
			}
			if (fieldName.endsWith('Rpc')) {
				continue;
			}
			rpcs[`${fieldName}Rpc`] = function (...args) {
				systems.get('Wsm').getWsm().sendToAll(`${name}.${fieldName}`, ...args);
			}
			wsm.addHandler(`${name}.${fieldName}`, (ws, ...args) => {
				system[fieldName](...args);
			})
		}
		for (let [rpcName, rpc] of Object.entries(rpcs)) {
			system[rpcName] = rpc;
		}
	}
	this.onSystemsReady = function () {
		systems.each((name, system) => {
			this._addRpc(name, system);
		});
	}
}