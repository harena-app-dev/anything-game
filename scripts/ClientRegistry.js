import { Registry } from './Registry.js';
export function fetchCmd({ name, args }) {
	return fetch(`http://localhost:3002/${name}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(args),
	}).then(response => {
		console.log(`fetchCmd ${name} response: ${response}`);
		return response.json()
	});
}
export default function ClientRegistry() {
	const registry = Registry();
	registry.connect = ({ wsm }) => {
		for (let [name, value] of Object.entries(registry)) {
			if (!(value instanceof Function)) {
				continue;
			}
			const cmdName = `cmd${name[0].toUpperCase()}${name.slice(1)}`;
			console.log(`cmdName: ${cmdName}`);
			registry[cmdName] = (args) => {
				wsm.send(name, args);
			};
			const fetchName = `fetch${name[0].toUpperCase()}${name.slice(1)}`;
			registry[fetchName] = (args) => {
				return fetchCmd({ name, args });
			};
			const f = registry[name].bind(registry);
			console.log(`handler ${name}`);
			wsm.addHandler(name, ({ ws, args }) => {
				f(args);
			});
		}
		registry.promiseSync = () => {
			return fetchCmd({ name: 'sync' }).then(newRegistry => {
				console.log(`newRegistry: ${JSON.stringify(newRegistry, null, 2)}`);
				registry.each({
					callback: ({ entity }) => {
						registry.onDestroy.notify({ entity });
					}
				});
				for (let [key, value] of Object.entries(newRegistry)) {
					if (key === 'typesToConstructors'
						|| key.startsWith('on')
					) {
						continue;
					}
					registry[key] = value;
				}
			});
		};
	}
	return registry;
}