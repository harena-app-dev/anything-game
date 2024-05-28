import Registry from './Registry.js';
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
export default function ServerRegistry() {
	const registry = Registry();

	registry.connect = ({ wsm, isClient, em }) => {
		for (let [name, value] of Object.entries(registry)) {
			if (!(value instanceof Function)) {
				continue;
			}
			if (name.startsWith('get')
				|| name.startsWith('has')
				|| name.startsWith('each')
				|| name.startsWith('map')
			) {
				continue;
			}
			const prevFunction = registry[name].bind(registry);
			registry[name] = (args) => {
				console.log(`registry.${name}(${JSON.stringify(args, null, 2)})`);
				wsm.sendToAll(name, args);
				return prevFunction(args);
			}
			em.setHandler({
				name,
				handler: (args) => {
					const notificationEntity = registry.create();
					const result = registry[name](args);
					return result;
				},
			});
			wsm.addHandler(name, ({ ws, args }) => {
				console.log(`wsm.addHandler ${name} ${JSON.stringify(args, null, 2)}`);
				registry[name](args);
			});
		}
		em.setHandler({
			name: 'sync',
			handler: () => {
				return registry;
			},
		});
	}

	return registry;
}