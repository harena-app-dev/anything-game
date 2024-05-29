import Log from '../Log';
export default function ({ registry }) {
	const system = {
	}
	// gen 10x10 sprites -5 to 5
	for (let x = -5; x < 5; x++) {
		for (let y = -5; y < 5; y++) {
			const entity = registry.create()
			registry.emplace({ type: "Position", entity, component: { x, y, z: 0 } })
			registry.emplace({ type: "Sprite", entity, component: { path: "rogue.png" } })
		}
	}
	return system
}