import * as THREE from 'three';	
import Log from '../Log';
export function isBrowser () {
	  return typeof window !== 'undefined';
}
export default function ({ registry, scene }) {
	const system = {
		pathsToTextures: {},
		pathsToMaterials: {},
		entitiesToMeshes: {},
		onEmplace: function ({ entity, component }) {
			Log.debug("SpriteRenderer.onLoad", { entity, component })
			const position = registry.getOrEmplace({ type: "Position", entity })
			const { path } = component
			let texture
			let material
			if (isBrowser())
			if (this.pathsToTextures[path]) {
				texture = this.pathsToTextures[path]
				material = this.pathsToMaterials[path]
			} else {
				texture = new THREE.TextureLoader().load(`sprites/${path}`)
				texture.magFilter = THREE.NearestFilter
				texture.minFilter = THREE.NearestFilter
				this.pathsToTextures[path] = texture
				material = new THREE.SpriteMaterial({ map: texture });
				this.pathsToMaterials[path] = material
			}
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
						this.onEmplace({ entity, component: registry.get({ type: "Sprite", entity }) })
					}
					const position = registry.get({ type: "Position", entity })
					registry.replace({ type: "Position", entity, component: position })
					this.entitiesToMeshes[entity].position.set(position.x, position.y, position.z)
				}
			})
		}
	}
	registry.onEmplace["Sprite"].connect(system.onEmplace.bind(system))
	return system
}