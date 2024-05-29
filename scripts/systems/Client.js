import WebSocketMessager from "../client/WebSocketMessager";
import Log from "../Log";
export function fetchCmd({ name, args }) {
	// return fetch(`http://localhost:3002/${name}`, {
	const currentUrl = window.location.href.split('/')
	const address = currentUrl[2].split(':')
	const port = address.length > 1 ? Number(address[1]) : 80
	const protocol = currentUrl[0] === 'http:' ? 'http' : 'https'

	console.log(`currentUrl: ${currentUrl}`);
	console.log(`${protocol}://${address[0]}:${port+2}/${name}`);
	// const port = currentUrl.includes('localhost') ? 3002 : 80;
	// return fetch(`http://localhost:3002/${name}`, {
	return fetch(`${protocol}://${address[0]}:${port+2}/${name}`, {
	// return fetch(`${currentUrl}${name}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(args),
	}).then(response => {
		if (!response.ok) {
			Log.error(`fetchCmd ${name} response not ok: ${response}`);
			return {};
		}
		Log.debug(`fetchCmd ${name} response: ${response}`);
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
		Log.debug(`updateHandler ${entity} ${JSON.stringify(component, null, 2)} ${type}`);
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