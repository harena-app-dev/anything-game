import WebSocketMessager from "../../client/WebSocketMessager";
import Log from "../../Log";
import { offsetPortOfCurrentUrl } from "../../Utils";

// export function fetchCmd({ name, args }) {
export function fetchCmd(name, ...args) {
	Log.info(`fetchCmd ${name} ${JSON.stringify(args, null, 2)}`);
	return fetch(`${offsetPortOfCurrentUrl(2)}/${name}`, {
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
export default function (registry) {
	Log.debug(`Client`);
	const system = {
		wsm: new WebSocketMessager({ port: 3001 }),
		onJson(json) {
			registry.fromJson(json);
			const updateHandler = this.wsm.addHandler('update', (ws, type, entity, component) => {
				registry.update(type, entity, component);
			});
			const eraseHandler = this.wsm.addHandler('erase', (ws, type, entity, component) => {
				registry.erase(type, entity, component);
			});
			const destroyHandler = this.wsm.addHandler('destroy', (ws, entity) => {
				registry.destroy(entity);
			});
			this.destructor = () => {
				this.wsm.removeHandler(createHandler);
				this.wsm.removeHandler(emplaceHandler);
				this.wsm.removeHandler(updateHandler);
				this.wsm.removeHandler(eraseHandler);
				this.wsm.removeHandler(destroyHandler);
				this.wsm.close();
			}
		},
		promiseSync() {
			// return fetchCmd({ name: 'toJson' }).then(this.onJson.bind(this));
			return fetchCmd('toJson').then(this.onJson.bind(this));
		},
		promiseCreate() {
			// return fetchCmd({ name: 'create' })
			return fetchCmd('create')
		},
		promiseEmplace(type, entity, component) {
			// return fetchCmd({ name: 'emplace', args: { entity, component, type } })
			return fetchCmd('emplace', type, entity, component)
		},
		promiseUpdate(type, entity, component) {
			// return fetchCmd({ name: 'update', args: { entity, component, type } })
			return fetchCmd('update', type, entity, component)
		},
		promiseErase(type, entity) {
			// return fetchCmd({ name: 'erase', args: { entity, type } })
			return fetchCmd('erase', type, entity)
		},
		promiseDestroy(entity) {
			return fetchCmd({ name: 'destroy', args: { entity } })
		},
		destructor() {
		}
	}

	return system
}