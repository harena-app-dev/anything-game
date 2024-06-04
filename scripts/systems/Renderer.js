import Log from '../log.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { Sky } from 'three/addons/objects/Sky.js';
export default function (registry, systems) {
	this._scene = new THREE.Scene()
	this.getScene = function () {
		return this._scene;
	}
	const sky = new Sky();
	sky.scale.setScalar(450000);

	const phi = THREE.MathUtils.degToRad(90);
	const theta = THREE.MathUtils.degToRad(180);
	const sunPosition = new THREE.Vector3().setFromSphericalCoords(1, phi, theta);

	sky.material.uniforms.sunPosition.value = sunPosition;

	this._scene.add(sky);

	const light = new THREE.AmbientLight(0xffffff);
	this._scene.add(light);
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
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild(this._renderer.domElement);
		const widthHeight = new THREE.Vector2(sceneElement.clientWidth, sceneElement.clientHeight);
		this.camera = new THREE.PerspectiveCamera(75, widthHeight.x / widthHeight.y, 0.1, 1000);
		const controls = new OrbitControls(this.camera, this._renderer.domElement);
		this.camera.position.y = 10;
		this.camera.rotation.x = -1.5;

		this._renderer.shadowMap.enabled = true;
		this._renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		//Create a DirectionalLight and turn on shadows for the light
		const light = new THREE.DirectionalLight(0xffffff, 1);
		light.position.set(0, 20, 20); //default; light shining from top
		light.castShadow = true; // default false
		this._scene.add(light);

		//Set up shadow properties for the light
		const shadowMapSize = 2048;
		light.shadow.mapSize.width = shadowMapSize; // default
		light.shadow.mapSize.height = shadowMapSize; // default
		light.shadow.camera.near = 0.1; // default
		light.shadow.camera.far = 500; // default
		const shadowRenderDistance = 64;
		light.shadow.camera.top = shadowRenderDistance;
		light.shadow.camera.bottom = -shadowRenderDistance ;
		light.shadow.camera.left = -shadowRenderDistance ;
		light.shadow.camera.right = shadowRenderDistance;

		// //Create a sphere that cast shadows (but does not receive them)
		// const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
		// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
		// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		// sphere.castShadow = true; //default is false
		// sphere.receiveShadow = false; //default
		// this._scene.add(sphere);

		// //Create a plane that receives shadows (but does not cast them)
		// const planeGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
		// const planeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
		// const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		// plane.receiveShadow = true;
		// this._scene.add(plane);

		//Create a helper for the shadow camera (optional)
		const helper = new THREE.CameraHelper(light.shadow.camera);
		// this._scene.add(helper);

		this.tick = function () {
			Log.debug(`Renderer.tick`);
			this._renderer.render(this._scene, this.camera);
			controls.update();
		}
		this.onSceneElementResize = function () {
			sceneElement.removeChild(this._renderer.domElement);
		}
	}
	this.getDomElement = function () {
		return this._renderer.domElement;
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
		// Log.debug(`Renderer.onUpdateScale`, entity, scale);
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