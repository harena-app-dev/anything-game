import Log from '../../Log';
export default function (registry) {
	const radius = 20
	for (let x = -radius; x < radius; x++) {
		for (let z = -radius; z < radius; z++) {
			const entity = registry.create()
			registry.emplace("Position", entity, { x, y: -1, z })
			// registry.emplace("Sprite", entity, { path: "grass1.png" })
			registry.emplace("Block", entity, { texture: "grass1.png" })
			const rng = Math.random()
			if (rng < 0.1) {
				const tree = registry.create()
				const treeScale = 1.5;
				registry.emplace("Position", tree, { x, y: 0, z })
				registry.emplace("Scale", tree, { x: treeScale, y: treeScale, z: treeScale })
				registry.emplace("Sprite", tree, { path: "tree.png" })
			} else if (rng < 0.15) {
				const dirtWall = registry.create()
				registry.emplace("Position", dirtWall, { x, y: 0, z })
				registry.emplace("Block", dirtWall, { texture: "dirt.png" })
			}
		}
	}
}