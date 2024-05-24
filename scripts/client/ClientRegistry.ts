import Registry, { Component, Entity } from "../Registry";
import WebSocketMessager from "./WebSocketMessager";
type EntityListener = (data: Component) => void;
export default class ClientRegistry extends Registry {
	#webSocketMessager: WebSocketMessager;
	#entityObservers: Map<Entity, Set<EntityListener>> = new Map();
	constructor(webSocketMessager: WebSocketMessager, entityRegistry: Registry) {
		super();
		this.#webSocketMessager = webSocketMessager;
		webSocketMessager.addHandler('loadEntities', ({data}) => {
			this.fromJson(data);
		});
		webSocketMessager.addHandler('updateEntity', ({id, data}) => {
			this.patch(id, data);
		});
		webSocketMessager.addHandler('destroyEntity', ({id}) => {
			this.destroy(id);
		});
	}
	addEntityListener(entity: Entity, listener: EntityListener) {
		if (!this.#entityObservers.has(entity)) {
			this.#entityObservers.set(entity, new Set());
		}	
		this.#entityObservers.get(entity)?.add(listener);
	}
	removeEntityListener(entity: Entity, listener: EntityListener) {
		this.#entityObservers.get(entity)?.delete(listener);
	}
	sendCreate() {
		this.#webSocketMessager.send('createEntity');
	}
}