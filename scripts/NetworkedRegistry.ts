import Registry from "./Registry";
// import WebSocketManager from "./WebSocketManager";
import WebSocket from "ws";

export default class NetworkedRegistry extends Registry {
	// #entityRegistry: Registry;
	#wsm: any;
	constructor() {
		super();
		// this.#entityRegistry = entityRegistry;
	}
	connect(wsm: any) {
		this.#wsm = wsm;
		wsm.addHandler('loadEntities', (ws: WebSocket) => {
			console.log('loadEntities');
			this.rpcSync(ws);
		});
		wsm.addHandler('createEntity', (ws: WebSocket, {id}: {id: number}) => {
			this.entitySet.add(id);
		});
		wsm.addHandler('updateEntity', (ws: WebSocket, {typeName, id, data}: {typeName: string, id: number, data: any}) => {
			console.log('updateEntity', typeName, id, data);
			this.patch(typeName, id, data);
		});
		wsm.addHandler('destroyEntity', (ws: WebSocket, {id}: {id: number}) => {
			this.destroy(id);
		});
	}
	rpcSync(ws: WebSocket) {
		this.#wsm.send(ws, 'loadEntities', { data: this.toJson() });
	}
	cmdSync() {
		this.#wsm.send('loadEntities');
	}
	create() {
		const id = super.create();
		this.#wsm.sendToAll('updateEntity', { id });
		return id;
	}
	cmdCreate() {
		this.#wsm.send('createEntity');
	}
	patch(typeName: string, id: number, data: any) {
		super.patch(typeName, id, data);
		this.#wsm.sendToAll('updateEntity', {typeName, id, data });
	}
	destroy(id: number) {
		super.destroy(id);
		this.#wsm.sendToAll('destroyEntity', { id });
	}
}