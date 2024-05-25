import { createRegistry } from './createRegistry.js';
export function createNetworkedRegistry() {
	const registry = createRegistry();
	registry.connect = ({ wsm, isClient }) => {
		for (let [name, value] of Object.entries(registry)) {
			if (!(value instanceof Function)) {
				continue;
			}
			if (isClient) {
				const cmdName = `cmd${name[0].toUpperCase()}${name.slice(1)}`;
				console.log(`cmdName: ${cmdName}`);
				registry[cmdName] = (args) => {
					wsm.send(name, args);
				};
			} else {
				const f = registry[name].bind(registry);
				registry[name] = (args) => {
					f(args);
					wsm.sendToAll(name, args);
				}
			}
			const f = registry[name].bind(registry);
			wsm.addHandler(name, ({ ws, args }) => {
				console.log(`handling ${name}`);
				f(args);
			});
		}
	}
	return registry;
}