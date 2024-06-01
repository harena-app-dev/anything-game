import WebSocketMessager from "../../client/WebSocketMessager";
import Log from "../../Log";
import { offsetPortOfCurrentUrl } from "../../Utils";
import Registry from "../../Registry";

// export function fetchCmd({ name, args }) {
let fetchCounter = 0;
export function fetchCmd(wsm, name, ...args) {
	Log.info(`fetchCmd`, name, args);
	Log.debug(`fetchCmd ${name} ${JSON.stringify(args, null, 2)}`);
	// const fetchUrl = `${offsetPortOfCurrentUrl(1)}/${name}`;
	// Log.debug(`fetchCmd ${name} fetchUrl: ${fetchUrl}`)
	// return fetch(fetchUrl, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify(args),
	// }).then(response => {
	// 	if (!response.ok) {
	// 		Log.error(`fetchCmd ${name} response not ok: ${response}`);
	// 		return {};
	// 	}
	// 	Log.debug(`fetchCmd`, response);
	// 	return response.json()
	// });
	// use WebSocketMessager instead of fetch
	const fetchId = fetchCounter++;
	return new Promise((resolve, reject) => {
		const handler = (ws, response) => {
			Log.info(`fetchCmd handler`, response);
			wsm.removeHandler(handler);
			resolve(response);
		}
		wsm.addHandler(`${name}${fetchId}`, handler);
		wsm.send(name, fetchId, ...args);
	})
	// register a handler for the response
	// send handler name and args to the server

}
export default function (registry, systems) {
	Log.debug(`Client`);
	const system = {
		_s2c: {},
		_c2s: {},
		// wsm: new WebSocketMessager(),
		promiseConnect() {
			return new Promise((resolve, reject) => {
				system.wsm = new WebSocketMessager(() => {
					resolve();
				});
			})
		},
		onJson(json) {
			Log.info(`onJson ${json}`, JSON.stringify(json, null, 2));
			// registry.fromJson(json);
			const tempRegistry = new Registry();
			tempRegistry.fromJson(json);
			Log.debug(`tempRegistry`, tempRegistry.size());
			const update = this.wsm.addHandler('update', (ws, type, serverEntity, component) => {
				if (this._s2c[serverEntity] === undefined) {
					this._s2c[serverEntity] = registry.create();
					this._c2s[this._s2c[serverEntity]] = serverEntity;
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
			return fetchCmd(this.wsm, 'toJson').then(this.onJson.bind(this));
		},
		promiseCreate() {
			return fetchCmd(this.wsm, 'create').then((serverEntity) => {
				if (this._s2c[serverEntity] === undefined) {
					this._s2c[serverEntity] = registry.create();
					this._c2s[this._s2c[serverEntity]] = serverEntity;
				}
				return this._s2c[serverEntity];
			})
		},
		promiseEmplace(type, entity, component) {
			const serverEntity = this._c2s[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseEmplace serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd(this.wsm, 'emplace', type, serverEntity, component).then((serverComponent) => {
				return registry.emplaceOrReplace(type, entity, serverComponent);
			})
		},
		promiseUpdate(type, entity, component) {
			const serverEntity = this._c2s[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseUpdate serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd(this.wsm, 'update', type, serverEntity, component).then((serverComponent) => {
				return registry.replace(type, entity, serverComponent);
			})
		},
		promiseErase(type, entity) {
			const serverEntity = this._c2s[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseErase serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd(this.wsm, 'erase', type, serverEntity).then(() => {
				return registry.erase(type, entity);
			})
		},
		promiseDestroy(entity) {
			const serverEntity = this._c2s[entity];
			if (serverEntity === undefined) {
				Log.error(`promiseDestroy serverEntity undefined ${entity}`);
				return;
			}
			return fetchCmd(this.wsm, 'destroy', serverEntity).then(() => {
				return registry.destroy(entity);
			})
		},
		promiseLogin({ username, password, isCreate = false }) {
			return fetchCmd(this.wsm, 'login', {
				username,
				password,
				isCreate,
			}).then((data) => {
				Log.info(`promiseLogin`, data);
				const { entity: serverPlayerEntity, message } = data;
				const playerEntity = this._s2c[serverPlayerEntity];
				Log.info(`promiseLogin`, playerEntity, serverPlayerEntity);
				systems.get('Player').setPlayerEntity(playerEntity);
				return data;
			})
		},
		destructor() {
		}
	}

	return system
}