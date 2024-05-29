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
	const createHandler =
	system.wsm.addHandler('create', () => {
		registry.create();
	});
	const emplaceHandler = system.wsm.addHandler('emplace', ({ ws, args }) => {
		const { entity, component, type } = args;
		registry.emplace({ entity, component, type });
	});
	const updateHandler =
	// system.wsm.addHandler('update', ({ entity, component, type }) => {
	system.wsm.addHandler('update', ({ ws, args }) => {
		const { entity, component, type } = args;
		registry.replace({ entity, component, type });
	});
	const eraseHandler =
	// system.wsm.addHandler('erase', ({ entity, type }) => {
	system.wsm.addHandler('erase', ({ ws, args }) => {
		const { entity, type } = args;
		registry.erase({ entity, type });
	});
	const destroyHandler =
	// system.wsm.addHandler('destroy', ({ entity }) => {
	system.wsm.addHandler('destroy', ({ ws, args }) => {
		const { entity } = args;
		registry.destroy({ entity });
	});
	system.deconstruct = () => {
		system.wsm.removeHandler(createHandler);
		system.wsm.removeHandler(emplaceHandler);
		system.wsm.removeHandler(updateHandler);
		system.wsm.removeHandler(eraseHandler);
		system.wsm.removeHandler(destroyHandler);
		system.wsm.close();
	}
	return system
}