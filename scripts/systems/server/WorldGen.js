import Log from '../../Log';
export default function (registry) {
	const system = {
	}
	for (let x = -5; x < 5; x++) {
		for (let y = -5; y < 5; y++) {
			const entity = registry.create()
			registry.emplace("Position", entity, { x, y, z: 0 })
			registry.emplace("Sprite", entity, { path: "grass1.png" })
			const rng = Math.random()
			if (rng < 0.1) {
				const tree = registry.create()
				registry.emplace("Position", tree, { x, y, z: 0.01 })
				registry.emplace("Sprite", tree, { path: "tree.png" })
			}
		}
	}
	return system
}