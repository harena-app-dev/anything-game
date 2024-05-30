import WebSocketMessager from "../../client/WebSocketMessager";
import Log from "../../Log";
import {offsetPortOfCurrentUrl} from "../../Utils";

export function fetchCmd({ name, args }) {
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
			const createHandler = this.wsm.addHandler('create', () => {
					registry.create();
				});
			const emplaceHandler = this.wsm.addHandler('emplace', ({ ws, args }) => {
				const { entity, component, type } = args;
				registry.emplace({ entity, component, type });
			});
			const updateHandler =
				this.wsm.addHandler('update', ({ ws, args }) => {
					const { entity, component, type } = args;
					Log.debug(`updateHandler ${entity} ${JSON.stringify(component, null, 2)} ${type}`);
					registry.replace({ entity, component, type });
				});
			const eraseHandler =
				this.wsm.addHandler('erase', ({ ws, args }) => {
					const { entity, type } = args;
					registry.erase({ entity, type });
				});
			const destroyHandler =
				this.wsm.addHandler('destroy', ({ ws, args }) => {
					const { entity } = args;
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
			return fetchCmd({ name: 'toJson' }).then(this.onJson.bind(this));
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
		promiseDestroy(entity) {
			return fetchCmd({ name: 'destroy', args: { entity } })
		},
		destructor() {
		}
	}

	return system
}