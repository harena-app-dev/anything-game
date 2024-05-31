import Log from '../../Log';
export default function (registry) {
	const radius = 20
	for (let x = -radius; x < radius; x++) {
		for (let y = -radius; y < radius; y++) {
			const entity = registry.create()
			registry.emplace("Position", entity, { x, y, z: -1 })
			// registry.emplace("Sprite", entity, { path: "grass1.png" })
			registry.emplace("Block", entity, { texture: "grass1.png" })
			const rng = Math.random()
			if (rng < 0.1) {
				const tree = registry.create()
				const treeScale = 1.5;
				registry.emplace("Position", tree, { x, y, z: 0.01 })
				registry.emplace("Scale", tree, { x: treeScale, y: treeScale, z: 1 })
				registry.emplace("Sprite", tree, { path: "tree.png" })
			}
		}
	}
}