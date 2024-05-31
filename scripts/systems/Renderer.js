import Log from '../Log.js';
import * as three from 'three';
export default function (registry, systems) {
	this._scene = new three.Scene() 
	this._entitiesToThree = {}
	this._threeToEntities = {}
	this.setSceneElement = function(sceneElement) {
		this._renderer = new three.WebGLRenderer();
		this._renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild(this._renderer.domElement);
		const widthHeight = new three.Vector2(sceneElement.clientWidth, sceneElement.clientHeight);
		let zoom = 100;
		const camera = new three.OrthographicCamera(widthHeight.x / -zoom, widthHeight.x / zoom, widthHeight.y / zoom, widthHeight.y / -zoom, 0.001, 1000);
		camera.position.z = 5;
		this.tick = function () {
			Log.debug(`Renderer.tick`);
			this._renderer.render(this._scene, camera);
		}
		this.destructor = function () {
			sceneElement.removeChild(this._renderer.domElement);
		}
	}
	this.add = function (entity, threeObject) {
		this._scene.add(threeObject);
		this._entitiesToThree[entity] = threeObject;
		this._threeToEntities[threeObject.id] = entity;
	}
}