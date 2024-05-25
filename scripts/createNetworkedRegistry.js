import {createRegistry} from './createRegistry.js';
export function createNetworkedRegistry({wsm}) {
	const registry = createRegistry();
	for (let [name, value] of Object.entries(registry)) {
		if (value instanceof Function) {
			wsm.addHandler(name, ({ws, args})=>{
				registry.name.bind(registry)(args);
			});
		}
	}
	return registry;
}