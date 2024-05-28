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
export function NetworkedRegistry() {
	const registry = Registry();

	registry.connect = ({ wsm, isClient, em }) => {
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
				const fetchName = `fetch${name[0].toUpperCase()}${name.slice(1)}`;
				registry[fetchName] = (args) => {
					// return fetch(`http://localhost:3002/${name}`, {
					// 	method: 'POST',
					// 	headers: {
					// 		'Content-Type': 'application/json',
					// 	},
					// 	body: JSON.stringify(args),
					// }).then(response => response.json());
					return fetchCmd({ name, args });
				};
			} else {
				const f = registry[name].bind(registry);
				registry[name] = (args) => {
					wsm.sendToAll(name, args);
					return f(args);
				}
				em.setHandler({
					name,
					handler: (args) => {
						const notificationEntity = registry.create();
						try {
							const result = registry[name](args);
							registry.emplace({
								entity: notificationEntity,
								type: 'Notification',
								component: {
									message: `${name}(${JSON.stringify(args, null, 2)})`,
									severity: 'success',
								},
							});
							return result;
						} catch (e) {
							registry.emplace({
								entity: notificationEntity,
								type: 'Notification',
								component: {
									message: `${name}(${JSON.stringify(args, null, 2)}) failed: ${e.message}`,
									severity: 'error',
								},
							});
						}
					},
				});
			}
			const f = registry[name].bind(registry);
			wsm.addHandler(name, ({ ws, args }) => {
				f(args);
			});
		}
		if (isClient) {
			registry.promiseSync = () => {
				return fetchCmd({ name: 'sync' }).then(newRegistry => {
					registry.each({
						callback: ({ entity }) => {
							registry.onDestroy.notify({ entity });
						}
					});
					for (let [key, value] of Object.entries(newRegistry)) {
						if ( key === 'typesToConstructors'
							|| key.startsWith('on')
						) {
							continue;
						}
						registry[key] = value;
					}
					// registry.each({
					// 	callback: ({ entity }) => {
					// 		registry.onCreate.notify({ entity });
					// 	}
					// });
				});
				// wsm.addHandler('sync', ({ ws, args }) => {
				// 	registry.sync(args);
				// });
				// registry.cmdSync();
			};
		} else {
			// registry.sync = ({ ws }) => {
			// 	wsm.send(ws, 'sync', registry);
			// };
			// wsm.addHandler('sync', ({ ws, args }) => {
			// 	wsm.send(ws, 'sync', JSON.stringify(registry));
			// });
			em.setHandler({
				name: 'sync',
				handler: () => {
					return registry;
				},
			});
		}

	}

	return registry;
}