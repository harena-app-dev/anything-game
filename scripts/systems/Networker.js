export default function ({ registry, scene }) {
	const system = {
		onEmplaceAny: function ({ entity, component, type }) {
			
		}
	}
	registry.onEmplaceAny.connect(system.onEmplaceAny.bind(onEmplaceAny))
	return system
}