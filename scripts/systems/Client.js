import WebSocketMessager from "../client/WebSocketMessager";
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
export default function ({ registry }) {
	const system = {
		wsm: new WebSocketMessager({ port: 3001 }),
		promiseSync() {
			return fetchCmd({ name: 'toJson' }).then(json => {
				registry.fromJson(json);
			})
		},
		promiseCreate() {
			return fetchCmd({ name: 'create' })
		},
		promiseEmplace({ entity, component, type }) {
			return fetchCmd({ name: 'emplace', args: { entity, component, type } })
		},
		promiseUpdate({ entity, component, type }) {
			return fetchCmd({ name: 'update', args: { entity, component, type } })
		},
		promiseErase({ entity, type }) {
			return fetchCmd({ name: 'erase', args: { entity, type } })
		},
		promiseDestroy({ entity }) {
			return fetchCmd({ name: 'destroy', args: { entity } })
		},
	}
	system.wsm.addHandler('create', () => {
		registry.create();
	});
	system.wsm.addHandler('emplace', ({ entity, component, type }) => {
		registry.emplace({ entity, component, type });
	});
	system.wsm.addHandler('update', ({ entity, component, type }) => {
		registry.update({ entity, component, type });
	});
	system.wsm.addHandler('erase', ({ entity, type }) => {
		registry.erase({ entity, type });
	});
	system.wsm.addHandler('destroy', ({ entity }) => {
		registry.destroy({ entity });
	});
	return system
}