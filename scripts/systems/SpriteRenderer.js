import * as THREE from 'three';

export default function ({ registry, scene }) {
	const system = {
		pathsToTextures: {},
		pathsToMaterials: {},
		entitiesToMeshes: {},
		onLoad: function ({ entity, component }) {
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
				material = new THREE.MeshBasicMaterial({ transparent: true, map: texture })
				this.pathsToMaterials[path] = material
			}
			const cube = new THREE.Mesh(geometry, material)
			scene.add(cube)
		},
		onRender() {
			registry.each({
				types: ["Sprite"], 
				callback: ({ entity }) => {
					if (this.entitiesToMeshes[entity] === undefined) {
						this.onLoad({ entity, component: registry.get({ type: "Sprite", entity }) })
					}
				}
			})
		}
	}
	registry.onEmplace["Sprite"].connect(system.onLoad.bind(system))
	return system
}