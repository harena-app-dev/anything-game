import Log from '../Log.js';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export default function (registry, systems) {
	this._scene = new THREE.Scene()
	this.getScene = function () {
		return this._scene;
	}
	// const light = new THREE.AmbientLight(0x404040); // soft white light
	const light = new THREE.AmbientLight(0xffffff); // soft white light
	// light.castShadow = true; // default false
	this._scene.add(light);
	const dirLight = new THREE.DirectionalLight(0xffffff, 1);
	// dirLight.position.set(-0.3, 1, 0).normalize();
	dirLight.position.set(0, 100, 0);
	dirLight.castShadow = true; // default false
	dirLight.shadow.mapSize.width = 512; // default
	dirLight.shadow.mapSize.height = 512; // default
	dirLight.shadow.camera.near = 0.5; // default
	dirLight.shadow.camera.far = 500; // default
	// dirLight.shadow.camera.left = -100; // default
	// dirLight.shadow.camera.right = 100; // default
	// dirLight.shadow.camera.top = 100; // default
	// dirLight.shadow.camera.bottom = -100; // default
	const dirLightParent = new THREE.Object3D();
	dirLightParent.rotation.y = 0.2;
	dirLightParent.add(dirLight);

	// this._scene.add(dirLightParent);
	// const helper = new THREE.CameraHelper(dirLight.shadow.camera)
	// this._scene.add(helper)

	// const planeGeometry = new THREE.PlaneGeometry(100, 20)
	// const plane = new THREE.Mesh(planeGeometry, new THREE.MeshPhongMaterial())
	// plane.rotateX(-Math.PI / 2)
	// plane.position.y = 0.5
	// plane.receiveShadow = true
	// this._scene.add(plane)

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
	let dirLightVelocity = 1;
	this.setSceneElement = function (sceneElement) {
		this._renderer = new THREE.WebGLRenderer();
		this._renderer.shadowMap.enabled = true;
		// this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this._renderer.setSize(sceneElement.clientWidth, sceneElement.clientHeight);
		sceneElement.appendChild(this._renderer.domElement);
		const widthHeight = new THREE.Vector2(sceneElement.clientWidth, sceneElement.clientHeight);
		let zoom = 100;
		// const camera = new THREE.OrthographicCamera(widthHeight.x / -zoom, widthHeight.x / zoom, widthHeight.y / zoom, widthHeight.y / -zoom, 0.001, 1000);
		this.camera = new THREE.PerspectiveCamera(75, widthHeight.x / widthHeight.y, 0.1, 1000);
		const controls = new OrbitControls( this.camera, this._renderer.domElement );

		// this.camera = new THREE.CameraHelper(directionalLight.shadow.camera)
		// scene.add(helper)
		this.camera.position.y = 10;
		// tilt the camera towards x
		this.camera.rotation.x = -1.5;
		this.tick = function () {
			Log.debug(`Renderer.tick`);
			this._renderer.render(this._scene, this.camera);
			controls.update();
			// if (dirLight.position.y > 100) {
			// 	dirLightVelocity = -1;
			// } else if (dirLight.position.y < -100) {
			// 	dirLightVelocity = 1;
			// }
			// dirLight.position.y += dirLightVelocity;
			dirLightParent.rotation.x += 0.01;
			// dirLightParent.rotation.y += 0.01;
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