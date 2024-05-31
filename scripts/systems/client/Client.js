import WebSocketMessager from "../../client/WebSocketMessager";
import Log from "../../Log";
import { offsetPortOfCurrentUrl } from "../../Utils";
import Registry from "../../Registry";

// export function fetchCmd({ name, args }) {
export function fetchCmd(name, ...args) {
	Log.debug(`fetchCmd ${name} ${JSON.stringify(args, null, 2)}`);
	const fetchUrl = `${offsetPortOfCurrentUrl(2)}/${name}`;
	Log.debug(`fetchCmd ${name} fetchUrl: ${fetchUrl}`)
	return fetch(fetchUrl, {
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
		_s2c: {},
		wsm: new WebSocketMessager({ port: 3001 }),
		onJson(json) {
			Log.debug(`onJson ${json}`, JSON.stringify(json, null, 2));
			// registry.fromJson(json);
			const tempRegistry = new Registry();
			tempRegistry.fromJson(json);
			Log.debug(`tempRegistry`, tempRegistry.size());
			const update = this.wsm.addHandler('update', (ws, type, entity, component) => {
				if (this._s2c[entity] === undefined) {
					this._s2c[entity] = registry.create();
				}
				registry.emplaceOrReplace(type, this._s2c[entity], component);
			});
			tempRegistry.each((entity) => {
				Log.debug(`onJson each entity ${entity}`);
				const types = tempRegistry.getTypes(entity);
				types.forEach((type) => {
					Log.debug(`onJson each entity type ${type}`);
					const component = tempRegistry.get(type, entity);
					update(null, type, entity, component);
				})
			})
			const eraseHandler = this.wsm.addHandler('erase', (ws, type, entity, component) => {
				registry.erase(type, this._s2c[entity], component);
			});
			const destroyHandler = this.wsm.addHandler('destroy', (ws, entity) => {
				registry.destroy(this._s2c[entity]);
			});
			this.destructor = () => {
				this.wsm.removeHandler(createHandler);
				this.wsm.removeHandler(emplaceHandler);
				this.wsm.removeHandler(update);
				this.wsm.removeHandler(eraseHandler);
				this.wsm.removeHandler(destroyHandler);
				this.wsm.close();
			}
		},
		promiseSync() {
			Log.debug(`promiseSync`);
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