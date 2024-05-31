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
		_c2s: {},
		wsm: new WebSocketMessager({ port: 3001 }),
		onJson(json) {
			Log.debug(`onJson ${json}`, JSON.stringify(json, null, 2));
			// registry.fromJson(json);
			const tempRegistry = new Registry();
			tempRegistry.fromJson(json);
			Log.debug(`tempRegistry`, tempRegistry.size());
			const update = this.wsm.addHandler('update', (ws, type, serverEntity, component) => {
				if (this._s2c[serverEntity] === undefined) {
					this._s2c[serverEntity] = registry.create();
				}
				registry.emplaceOrReplace(type, this._s2c[serverEntity], component);
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
			const eraseHandler = this.wsm.addHandler('erase', (ws, type, serverEntity) => {
				registry.erase(type, this._s2c[serverEntity]);
			});
			const destroyHandler = this.wsm.addHandler('destroy', (ws, serverEntity) => {
				registry.destroy(this._s2c[serverEntity]);
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
			return fetchCmd('create').then((serverEntity) => {
				if (this._s2c[serverEntity] === undefined) {
					this._s2c[serverEntity] = registry.create();
				}
				return this._s2c[serverEntity];
			})
		},
		promiseEmplace(type, entity, component) {
			const serverEntity = this._s2c[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseEmplace serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd('emplace', type, serverEntity, component).then((serverComponent) => {
				return registry.emplace(type, entity, serverComponent);
			})
		},
		promiseUpdate(type, entity, component) {
			// return fetchCmd({ name: 'update', args: { entity, component, type } })
			// return fetchCmd('update', type, entity, component)
			const serverEntity = this._s2c[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseUpdate serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd('update', type, serverEntity, component).then((serverComponent) => {
				return registry.replace(type, entity, serverComponent);
			})
		},
		promiseErase(type, entity) {
			// return fetchCmd({ name: 'erase', args: { entity, type } })
			// return fetchCmd('erase', type, entity)
			const serverEntity = this._s2c[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseErase serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd('erase', type, serverEntity).then(() => {
				return registry.erase(type, entity);
			})
		},
		promiseDestroy(entity) {
			// return fetchCmd('destroy', entity).
			const serverEntity = this._s2c[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseDestroy serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd('destroy', serverEntity).then(() => {
				return registry.destroy(entity);
			})
		},
		destructor() {
		}
	}

	return system
}