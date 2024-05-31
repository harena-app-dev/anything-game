import Log from '../../Log.js';
import * as THREE from 'three';
export default function (registry, systems) {
	this._scene = new three.Scene() 
	this._entitiesToThree = {}
	this._threeToEntities = {}
	this.setSceneElement = function(sceneElement) {
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild(this._renderer.domElement);
		const widthHeight = new THREE.Vector2(sceneElement.clientWidth, sceneElement.clientHeight);
		let zoom = 100;
		const camera = new THREE.OrthographicCamera(widthHeight.x / -zoom, widthHeight.x / zoom, widthHeight.y / zoom, widthHeight.y / -zoom, 0.001, 1000);
		camera.position.z = 5;
		this.tick = function () {
			this._renderer.render(this._scene, camera);
		}
		this.destructor = function () {
			sceneElement.removeChild(this._renderer.domElement);
		}
	}
}