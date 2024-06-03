import * as THREE from 'three';
export default THREE.Vector3;
// emplace(type, entity, _component) {
// 	Log.debug(`emplace`, type, entity, _component);
// 	if (!this.valid(entity)) {
// 		Log.error(`Entity ${entity} does not exist`);
// 		return;
// 	}
// 	if (this.entitiesToTypes[entity].includes(type)) {
// 		Log.error(`Entity ${entity} already has component of type ${type}`);
// 		return;
// 	}
// 	let component;
// 	if (!(this.typesToConstructors[type] instanceof Function)) {
// 		component = structuredClone(this.typesToConstructors[type]);
// 	} else {
// 		component = this.typesToConstructors[type]();
// 	}
// 	if (component !== undefined) {
// 		component = { ...component, ...component };
// 	}
// 	this.getPool(type)[entity] = component;
// 	this.entitiesToTypes[entity].push(type);
// 	this.onEmplace(type).notify(entity, component)
// 	this.onEmplace().notify(type, entity, component);
// 	return component;
// },