export function createRegistry() {
	return {
		entitySet: {},
		entityIdCounter: 0,
		componentPools: {},
		create() {
			const id = this.entityIdCounter++;
			this.entitySet[id] = {};
			return id;
		},
		emplace({ type, id, component }) {
			if (!this.componentPools[type]) {
				this.componentPools[type] = {};
			}
			this.componentPools[type][id] = component;
		},
		destroy({id}) {
			delete this.entitySet[id];
		},
		get({ type, id }) {
			return this.componentPools[type][id];
		},
	};
}