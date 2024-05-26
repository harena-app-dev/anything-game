import { Registry } from './Registry.js';
export function NetworkedRegistry() {
	const registry = Registry();
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
					wsm.sendToAll(name, args);
					return f(args);
				}
			}
			const f = registry[name].bind(registry);
			wsm.addHandler(name, ({ ws, args }) => {
				console.log(`handling ${name}`);
				f(args);
			});
		}
		if (isClient) {
			registry.cmdSync = () => {
				wsm.send('sync');
			};
			registry.sync = (jsonString) => {
				const newRegistry = JSON.parse(jsonString);
				registry.each({ callback: ({ entity }) => {
					registry.onDestroy.notify({ entity });
				}});
				for (let [key, value] of Object.entries(newRegistry)) {
					if (registry.unsynced.has(key)) {
						continue;
					}
					registry[key] = value;
				}
				registry.each({ callback: ({ entity }) => {
					registry.onCreate.notify({ entity });
				}});
			};
			wsm.addHandler('sync', ({ ws, args }) => {
				registry.sync(args);
			});
			registry.cmdSync();
		} else {
			registry.sync = ({ws}) => {
				wsm.send(ws, 'sync', registry);
			};
			wsm.addHandler('sync', ({ ws, args }) => {
				wsm.send(ws, 'sync', JSON.stringify(registry));
			});
		}
	}
	return registry;
}