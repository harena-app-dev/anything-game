import * as THREE from 'three';
import Log from '../log';
export function isBrowser() {
	return typeof window !== 'undefined';
}
export default function (registry, systems) {
	// const threeInterface = systems.get('ThreeInterface');
	// const scene = threeInterface.getScene();
	this._pathsToTextures = {}
	this._pathsToMaterials = {}
	this._entitiesToThree = {}
	this._threeToEntities = {}
	this._onEmplace = function (entity, spriteComponent) {
		const position = registry.getOrEmplace("Position", entity)
		const { path } = spriteComponent
		let texture
		let material
		if (isBrowser())
			if (this._pathsToTextures[path]) {
				texture = this._pathsToTextures[path]
				material = this._pathsToMaterials[path]
			} else {
				texture = new THREE.TextureLoader().load(`textures/${path}`)
				texture.colorSpace = THREE.SRGBColorSpace
				texture.magFilter = THREE.NearestFilter
				texture.minFilter = THREE.NearestFilter
				this._pathsToTextures[path] = texture
				material = new THREE.SpriteMaterial({ map: texture });
				this._pathsToMaterials[path] = material
			}
		const sprite = new THREE.Sprite(material);
		Log.debug(`SpriteRenderer new sprite`, { entity, spriteComponent, sprite })
		sprite.position.set(position.x, position.y, position.z)
		this._entitiesToThree[entity] = sprite.id
		this._threeToEntities[sprite.id] = entity
		// scene.add(sprite)
		systems.get("Renderer").add(entity, sprite)
	}
	this.getEntityFromThreeId = function (id) {
		return this._threeToEntities[id]
	}
	this._onErase = function(entity) {
		const mesh = this._entitiesToThree[entity]
		scene.remove(this._entitiesToThree[entity])
		delete this._entitiesToThree[entity]
		delete this._threeToEntities[mesh]
	}
	this.tick = function() {
		registry.view("Sprite").each((entity) => {
			if (this._entitiesToThree[entity] === undefined) {
				Log.debug("SpriteRenderer.tick", { entity })
				this._onEmplace(entity, registry.get("Sprite", entity))
			}
		})
	}
	const observers = [
		registry.onEmplace("Sprite").connect(this._onEmplace.bind(this)),
		registry.onErase("Sprite").connect(this._onErase.bind(this)),
	]
	this.destructor = function() {
		for (let observer of observers) {
			observer.disconnect()
		}
	}
	return this
}