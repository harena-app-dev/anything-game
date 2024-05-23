import EntityRegistry from "../EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";

export default class ClientEntityRegistry {
	#entityRegistry: EntityRegistry;
	#webSocketMessager: WebSocketMessager;
	constructor(webSocketMessager: WebSocketMessager, entityRegistry: EntityRegistry) {
		this.#entityRegistry = entityRegistry;
		this.#webSocketMessager = webSocketMessager;
		webSocketMessager.addHandler('loadEntities', ({data}) => {
			this.#entityRegistry.fromJson(data);
		});
		webSocketMessager.addHandler('updateEntity', ({id, data}) => {
			this.#entityRegistry.patch(id, data);
		});
		webSocketMessager.addHandler('destroyEntity', ({id}) => {
			this.#entityRegistry.destroy(id);
		});
	}
	create(data: any) {
		this.#webSocketMessager.send('createEntity', {data});
		// const id = this.#entityRegistry.create(data);
		// return id;
	}
	get(id: number) {
		return this.#entityRegistry.get(id);
	}
	patch(id: number, data: any) {
		this.#entityRegistry.patch(id, data);
	}
	destroy(id: number) {
		this.#entityRegistry.destroy(id);
	}
}