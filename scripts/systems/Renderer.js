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
		// const camera = new three.OrthographicCamera(widthHeight.x / -zoom, widthHeight.x / zoom, widthHeight.y / zoom, widthHeight.y / -zoom, 0.001, 1000);
		const camera = new three.PerspectiveCamera(75, widthHeight.x / widthHeight.y, 0.1, 1000);
		camera.position.z = 10;
		// tilt the camera towards x
		camera.rotation.x = 0.1;
		this.tick = function () {
			Log.debug(`Renderer.tick`);
			this._renderer.render(this._scene, camera);
		}
		this.onSceneElementResize = function() {
			sceneElement.removeChild(this._renderer.domElement);
		}
	}
	this.onUpdatePosition = function (entity, position) {
		const threeObject = this._entitiesToThree[entity];
		threeObject.position.x = position.x;
		threeObject.position.y = position.y;
		threeObject.position.z = position.z;
	}
	registry.onUpdate("Position").connect(this.onUpdatePosition.bind(this));
	this.onUpdateScale = function (entity, scale) {
		const threeObject = this._entitiesToThree[entity];
		threeObject.scale.x = scale.x;
		threeObject.scale.y = scale.y;
		threeObject.scale.z = scale.z;
	}
	registry.onUpdate("Scale").connect(this.onUpdateScale.bind(this));
	this.add = function (entity, threeObject) {
		Log.debug(`Renderer.add:`, entity, threeObject);
		this._scene.add(threeObject);
		this._entitiesToThree[entity] = threeObject;
		this._threeToEntities[threeObject.id] = entity;
		this.onUpdatePosition(entity, registry.getOrEmplace("Position", entity));
		this.onUpdateScale(entity, registry.getOrEmplace("Scale", entity));
		registry.getOrEmplace("Position", entity);
		registry.getOrEmplace("Scale", entity);
	}
}