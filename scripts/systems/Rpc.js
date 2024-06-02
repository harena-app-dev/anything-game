import Log from '../Log.js';
import { getParameterNames } from '../Utils.js';
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
			const parameterNames = getParameterNames(field);
			rpcs[`${fieldName}Rpc`] = function (...args) {
				const client = systems.get('Client');
				// if a param name ends with 'entity', then map it to a server entity using client.e2s
				const serverArgs = args.map((arg, i) => {
					if (parameterNames[i].toLowerCase().endsWith('entity')) {
						return client.c2s(arg);
					}
					return arg;
				});
				// systems.get('Wsm').getWsm().sendToAll(`${name}.${fieldName}`, ...args);
				systems.get('Wsm').getWsm().sendToAll(`${name}.${fieldName}`, ...serverArgs);
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