import Registry from "../Registry";
import WebSocketMessager from "./WebSocketMessager";
import WebSocket from "ws";

export default class ServerRegistry extends Registry {
	// #entityRegistry: Registry;
	#wsm: WebSocketMessager;
	constructor(wsm: WebSocketMessager) {
		super();
		// this.#entityRegistry = entityRegistry;
		this.#wsm = wsm;
		wsm.addHandler('loadEntities', (ws: WebSocket) => {
			console.log('loadEntities');
			this.sendTo(ws);
		});
		wsm.addHandler('createEntity', () => {
			this.create();
		});
		wsm.addHandler('updateEntity', (ws: WebSocket, {id, data}) => {
			this.patch(id, data);
		});
		wsm.addHandler('destroyEntity', (ws: WebSocket, {id}) => {
			this.destroy(id);
		});
	}
	sendTo(ws: WebSocket) {
		this.#wsm.send(ws, 'loadEntities', { data: this.toJson() });
	}
	create() {
		const id = super.create();
		this.#wsm.sendToAll('updateEntity', { id, data: this.get(id) });
		return id;
	}
	patch(id: number, data: any) {
		super.patch(id, data);
		this.#wsm.sendToAll('updateEntity', { id, data });
	}
	destroy(id: number) {
		super.destroy(id);
		this.#wsm.sendToAll('destroyEntity', { id });
	}
}