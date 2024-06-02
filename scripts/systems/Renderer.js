import Log from '../Log.js';
import * as three from 'three';
export default function (registry, systems) {
	this._scene = new three.Scene()
	this.getScene = function () {
		return this._scene;
	}
	// const light = new three.AmbientLight(0x404040); // soft white light
	// this._scene.add(light);
	// const directionalLight = new three.DirectionalLight( 0xffffff, 1 ); 
	// directionalLight.position.set( 0.3, 1, 0 ).normalize();
	// this._scene.add( directionalLight );
	this._entitiesToThree = {}
	this._threeToEntities = {}
	this._pathsToTextures = {}
	this._pathsToMaterials = {}
	this.e2t = function (entity) {
		return this._entitiesToThree[entity];
	}
	this.t2e = function (id) {
		return this._threeToEntities[id];
	}
	this.setSceneElement = function (sceneElement) {
		this._renderer = new three.WebGLRenderer();
		this._renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild(this._renderer.domElement);
		const widthHeight = new three.Vector2(sceneElement.clientWidth, sceneElement.clientHeight);
		let zoom = 100;
		// const camera = new three.OrthographicCamera(widthHeight.x / -zoom, widthHeight.x / zoom, widthHeight.y / zoom, widthHeight.y / -zoom, 0.001, 1000);
		this.camera = new three.PerspectiveCamera(75, widthHeight.x / widthHeight.y, 0.1, 1000);
		this.camera.position.y = 10;
		// tilt the camera towards x
		this.camera.rotation.x = -1.5;
		this.tick = function () {
			Log.debug(`Renderer.tick`);
			this._renderer.render(this._scene, this.camera);
		}
		this.onSceneElementResize = function () {
			sceneElement.removeChild(this._renderer.domElement);
		}
	}
	this.onUpdatePosition = function (entity, position) {
		Log.debug(`Renderer.onUpdatePosition`, entity, position);
		const threeId = this._entitiesToThree[entity];
		if (threeId === undefined) {
			return;
		}
		const threeObject = this._scene.getObjectById(threeId);
		threeObject.position.x = position.x;
		threeObject.position.y = position.y;
		threeObject.position.z = position.z;
	}
	registry.onUpdate("Position").connect(this.onUpdatePosition.bind(this));
	this.getThreeObject = function (entity) {
		return this._scene.getObjectById(this._entitiesToThree[entity]);
	}
	this.onUpdateScale = function (entity, scale) {
		const threeObject = this.getThreeObject(entity);
		if (threeObject === undefined) {
			return;
		}
		threeObject.scale.x = scale.x;
		threeObject.scale.y = scale.y;
		threeObject.scale.z = scale.z;
	}
	registry.onUpdate("Scale").connect(this.onUpdateScale.bind(this));
	this.add = function (entity, threeObject) {
		Log.debug(`Renderer.add:`, entity, threeObject);
		this._scene.add(threeObject);
		this._entitiesToThree[entity] = threeObject.id;
		this._threeToEntities[threeObject.id] = entity;
		this.onUpdatePosition(entity, registry.getOrEmplace("Position", entity));
		this.onUpdateScale(entity, registry.getOrEmplace("Scale", entity));
		registry.getOrEmplace("Position", entity);
		registry.getOrEmplace("Scale", entity);
	}
}