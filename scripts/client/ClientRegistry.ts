import Registry, { EntityComponent, Entity } from "../Registry";
import WebSocketMessager from "./WebSocketMessager";
type EntityListener = (data: EntityComponent) => void;
export default class ClientRegistry extends Registry {
	#webSocketMessager: WebSocketMessager;
	#entityObservers: Map<Entity, Set<EntityListener>> = new Map();
	constructor(wsm: WebSocketMessager) {
		super();
		this.#webSocketMessager = wsm;
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
	observe(entity: Entity, listener: EntityListener) {
		if (!this.#entityObservers.has(entity)) {
			this.#entityObservers.set(entity, new Set());
		}	
		this.#entityObservers.get(entity)?.add(listener);
	}
	unobserve(entity: Entity, listener: EntityListener) {
		this.#entityObservers.get(entity)?.delete(listener);
	}
	sendCreate() {
		this.#webSocketMessager.send('createEntity');
	}
}