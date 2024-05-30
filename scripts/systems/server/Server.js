import WebSocketMessager from "../../server/WebSocketMessager";
import ExpressMessager from "../../server/ExpressMessager";
export default function (registry) {
	const system = {
		wsm: WebSocketMessager({ port: 3001 }),
		em: ExpressMessager({ port: 3002 }),
	}
	registry.onEmplace().connect(function (type, entity, component) {
		system.wsm.sendToAll("update", [type, entity, component])
	})
	registry.onUpdate().connect(function (type, entity, component) {
		system.wsm.sendToAll("update", [type, entity, component])
	})
	registry.onErase().connect(function (type, entity, component) {
		system.wsm.sendToAll("erase", [type, entity, component])
	})
	registry.onDestroy().connect(function (entity) {
		system.wsm.sendToAll("destroy", [entity])
	})
	system.em.setHandler({
		name: 'toJson',
		handler: () => {
			return registry.toJson();
		},
	});
	system.em.setHandler({
		name: 'create',
		handler: () => {
			return registry.create();
		},
	});
	system.em.setHandler({
		name: 'emplace',
		handler: (...args) => {
			return registry.emplace(...args);
		},
	});
	system.em.setHandler({
		name: 'update',
		handler: (...args) => {
			return registry.update(...args);
		},
	});
	system.em.setHandler({
		name: 'erase',
		handler: (...args) => {
			return registry.erase(...args);
		},
	});
	system.em.setHandler({
		name: 'destroy',
		handler: (entity) => {
			return registry.destroy(entity);
		},
	});
	return system
}