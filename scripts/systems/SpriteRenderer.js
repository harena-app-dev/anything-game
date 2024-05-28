import * as THREE from 'three';

export default function ({ registry, scene }) {
	const system = {
		pathsToTextures: {},
		pathsToMaterials: {},
		entitiesToMeshes: {},
		onLoad: function ({ entity, component }) {
			const position = registry.getOrEmplace({ type: "Position", entity })
			const { path } = component
			const geometry = new THREE.BoxGeometry(1, 1, 1)
			let texture
			let material
			if (this.pathsToTextures[path]) {
				texture = this.pathsToTextures[path]
				material = this.pathsToMaterials[path]
			} else {
				texture = new THREE.TextureLoader().load(`sprites/${path}`)
				texture.magFilter = THREE.NearestFilter
				texture.minFilter = THREE.NearestFilter
				this.pathsToTextures[path] = texture
				// material = new THREE.MeshBasicMaterial({ transparent: true, map: texture })
				material = new THREE.SpriteMaterial({ map: texture });
				this.pathsToMaterials[path] = material
			}
			// const sprite = new THREE.Mesh(geometry, material)
			const sprite = new THREE.Sprite(material);
			sprite.position.set(position.x, position.y, position.z)
			this.entitiesToMeshes[entity] = sprite
			scene.add(sprite)
		},
		onRender() {
			registry.each({
				types: ["Sprite"],
				callback: ({ entity }) => {
					if (this.entitiesToMeshes[entity] === undefined) {
						this.onLoad({ entity, component: registry.get({ type: "Sprite", entity }) })
					}
					const position = registry.get({ type: "Position", entity })
					position.x += 0.001
					this.entitiesToMeshes[entity].position.set(position.x, position.y, position.z)
				}
			})
		}
	}
	registry.onEmplace["Sprite"].connect(system.onLoad.bind(system))
	return system
}