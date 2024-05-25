export function createRegistry() {
	return {
		entitySet: {},
		entityIdCounter: 0,
		componentPools: {},
		create() {
			const id = this.entityIdCounter++;
			this.entitySet[id] = {};
			return id;
		}
	};
}