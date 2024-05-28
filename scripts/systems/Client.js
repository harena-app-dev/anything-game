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
		wsm: WebSocketMessager({ port: 3001 }),
		promiseSync() {
			return fetchCmd({ name: 'toJson' }).then(json => {
				registry.fromJson(json);
			})
		},
	}
	wsm.addHandler('create', () => {
		registry.create();
	});
	wsm.addHandler('emplace', ({ entity, component, type }) => {
		registry.emplace({ entity, component, type });
	});
	wsm.addHandler('update', ({ entity, component, type }) => {
		registry.update({ entity, component, type });
	});
	wsm.addHandler('erase', ({ entity, type }) => {
		registry.erase({ entity, type });
	});
	wsm.addHandler('destroy', ({ entity }) => {
		registry.destroy({ entity });
	});
	return system
}