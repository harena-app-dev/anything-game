import WebSocketMessager from "../../client/WebSocketMessager";
import Log from "../../Log";
import { offsetPortOfCurrentUrl } from "../../Utils";
import Registry from "../../Registry";

let fetchCounter = 0;
export function fetchCmd(wsm, name, ...args) {
	Log.debug(`fetchCmd`, name, args);
	Log.debug(`fetchCmd ${name} ${JSON.stringify(args, null, 2)}`);
	const fetchId = fetchCounter++;
	return new Promise((resolve, reject) => {
		const handler = (ws, response) => {
			Log.debug(`fetchCmd handler`, response);
			wsm.removeHandler(handler);
			resolve(response);
		}
		wsm.addHandler(`${name}${fetchId}`, handler);
		wsm.sendToAll(name, fetchId, ...args);
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
				system.wsm = new WebSocketMessager({
					onConnection() {
						Log.debug(`onConnection`);
						resolve();
					}
				});
			})
		},
		onJson(json) {
			Log.debug(`onJson ${json}`, JSON.stringify(json, null, 2));
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
			const handlers = [update,
				this.wsm.addHandler('erase', (ws, type, serverEntity) => {
					registry.erase(type, this._s2c[serverEntity]);
				}),
				this.wsm.addHandler('destroy', (ws, serverEntity) => {
					registry.destroy(this._s2c[serverEntity]);
				}),
			];
			this.destructor = () => {
				handlers.forEach((handler) => {
					this.wsm.removeHandler(handler);
				})
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
				const { accountEntity, message } = data;
				// const playerEntity = this._s2c[accountEntity];
				const account = registry.get('Account', accountEntity);
				Log.info(`promiseLogin`, message, account);
				systems.get('Player').setPlayerEntity(account.playerEntity);
				return data;
			})
		},
		destructor() {
		}
	}
	registry.onUpdate().connect(function (...args) {
		// const [type, entity, component] = args;
		// if (registry.has('AccountOwner', entity)) {
		// 	const accountEntity = registry.get('AccountOwner', entity).accountEntity;
		// 	system.wsm.forEachConnection(ws => {
		// 		if (ws === accountsToWs[accountEntity]) {
		// 			return;
		// 		}
		// 		system.wsm.send(ws, 'update', ...args);
		// 	});
		// 	return;
		// }
		// system.wsm.sendToAll('update', ...args);
	})
	return system
}