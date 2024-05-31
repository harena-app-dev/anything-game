import * as THREE from 'three';
import Log from '../Log';
export function isBrowser() {
	return typeof window !== 'undefined';
}
export default function (registry, systems) {
	this._pathsToTextures = {}
	this._pathsToMaterials = {}
	const renderer = systems.get("Renderer")
	this._onEmplace = function (entity, block) {
		let texture
		let material
		if (isBrowser()) {
			if (this._pathsToTextures[block.texture]) {
				texture = this._pathsToTextures[block.texture]
				material = this._pathsToMaterials[block.texture]
			} else {
				texture = new THREE.TextureLoader().load(`textures/${block.texture}`)
				texture.colorSpace = THREE.SRGBColorSpace
				texture.magFilter = THREE.NearestFilter
				texture.minFilter = THREE.NearestFilter
				this._pathsToTextures[block.texture] = texture
				material = new THREE.MeshBasicMaterial({ map: texture });
				this._pathsToMaterials[block.texture] = material
			}
		}
		const geometry = new THREE.BoxGeometry(1, 1, 1)
		const threeObject = new THREE.Mesh(geometry, material)
		renderer.add(entity, threeObject)
	}
	this._onErase = function(entity) {
		scene.remove(this._entitiesToThree[entity])
	}
	this.tick = function() {
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