export function createRegistry() {
	return {
		entitySet: {},
		entityIdCounter: 0,
		componentPools: {},
	};
}