import * as THREE from 'three';
import Log from '../Log';
export function isBrowser() {
	return typeof window !== 'undefined';
}
export default function (registry, systems) {
	this._pathsToTextures = {}
	this._pathsToMaterials = {}
	this._onEmplace = function (entity, block) {
		const { path } = block
		let texture
		let material
		if (isBrowser()) {
			if (this._pathsToTextures[path]) {
				texture = this._pathsToTextures[path]
				material = this._pathsToMaterials[path]
			} else {
				texture = new THREE.TextureLoader().load(`textures/${path}`)
				texture.colorSpace = THREE.SRGBColorSpace
				texture.magFilter = THREE.NearestFilter
				texture.minFilter = THREE.NearestFilter
				this._pathsToTextures[path] = texture
				material = new THREE.MeshBasicMaterial({ map: texture });
				this._pathsToMaterials[path] = material
			}
		}
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const threeObject = new THREE.Mesh(geometry, material)
		// Log.info(`Renderer.add:`, entity, threeObject);
		systems.get("Renderer").add(entity, threeObject)
	}
	this._onErase = function(entity) {
		scene.remove(this._entitiesToThree[entity])
	}
	this.tick = function() {
		// registry.view("Block").each((entity) => {
		// 	if (this._entitiesToThree[entity] === undefined) {
		// 		this._onEmplace(entity, registry.get("Block", entity))
		// 	}
		// })
	}
	const observers = [
		registry.onEmplace("Block").connect(this._onEmplace.bind(this)),
		registry.onErase("Block").connect(this._onErase.bind(this)),
	]
	this.destructor = function() {
		for (let observer of observers) {
			observer.disconnect()
		}
	}
	return this
}