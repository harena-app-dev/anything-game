import Registry, { EntityComponent, Entity } from "../Registry";
import WebSocketMessager from "./WebSocketMessager";
export default class ClientRegistry extends Registry {
	#wsm?: WebSocketMessager;
	constructor() {
		super();
	}
	connect(wsm: WebSocketMessager) {
		this.#wsm = wsm;
		wsm.addHandler('loadEntities', ({data}) => {
			this.fromJson(data);
		});
		wsm.addHandler('updateEntity', ({id, data}) => {
			this.patch(id, data);
		});
		wsm.addHandler('destroyEntity', ({id}) => {
			this.destroy(id);
		});
		wsm.send('loadEntities');
	}
	sendCreate() {
		if (!this.#wsm) {
			throw new Error('No connection to server');
		}
		this.#wsm.send('createEntity');
	}
}