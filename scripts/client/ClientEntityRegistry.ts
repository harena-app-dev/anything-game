import EntityRegistry, { Component, Entity } from "../EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";
type EntityListener = (data: Component) => void;
export default class ClientEntityRegistry {
	#entityRegistry: EntityRegistry;
	#webSocketMessager: WebSocketMessager;
	#entityObservers: Map<Entity, Set<EntityListener>> = new Map();
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
	addEntityListener(entity: Entity, listener: EntityListener) {
		if (!this.#entityObservers.has(entity)) {
			this.#entityObservers.set(entity, new Set());
		}
		this.#entityObservers.get(entity)?.add(listener);
	}
	removeEntityListener(entity: Entity, listener: EntityListener) {
		this.#entityObservers.get(entity)?.delete(listener);
	}
	create(data: any) {
		this.#webSocketMessager.send('createEntity', {data});
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