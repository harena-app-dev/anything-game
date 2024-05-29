import Log from '../Log';
export default function ({ registry }) {
	const system = {
	}
	for (let x = -5; x < 5; x++) {
		for (let y = -5; y < 5; y++) {
			const entity = registry.create()
			registry.emplace({ type: "Position", entity, component: { x, y, z: 0 } })
			registry.emplace({ type: "Sprite", entity, component: { path: "dirt.png" } })
			const rng = Math.random()
			if (rng < 0.1) {
				const tree = registry.create()
				registry.emplace({ type: "Position", entity: tree, component: { x, y, z: 0.01 } })
				registry.emplace({ type: "Sprite", entity: tree, component: { path: "tree.png" } })
			}
		}
	}
	return system
}