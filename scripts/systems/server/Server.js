import WebSocketMessager from "../../server/WebSocketMessager";
import ExpressMessager from "../../server/ExpressMessager";
export default function ({ registry }) {
	const system = {
		wsm: WebSocketMessager({ port: 3001 }),
		em: ExpressMessager({ port: 3002 }),
	}
	registry.onCreate().connect(function ({ entity }) {
		system.wsm.sendToAll("create", { entity })
	})
	registry.onEmplace().connect(function ({ entity, component, type }) {
		system.wsm.sendToAll("emplace", { entity, component, type })
	})
	registry.onUpdate().connect(function ({ entity, component, type }) {
		system.wsm.sendToAll("update", { entity, component, type })
	})
	registry.onErase().connect(function ({ entity, type }) {
		system.wsm.sendToAll("erase", { entity, type })
	})
	registry.onDestroy().connect(function ({ entity }) {
		system.wsm.sendToAll("destroy", { entity })
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
		handler: ({ entity, component, type }) => {
			return registry.emplace({ entity, component, type });
		},
	});
	system.em.setHandler({
		name: 'update',
		handler: ({ entity, component, type }) => {
			return registry.update({ entity, component, type });
		},
	});
	system.em.setHandler({
		name: 'erase',
		handler: ({ entity, type }) => {
			return registry.erase({ entity, type });
		},
	});
	system.em.setHandler({
		name: 'destroy',
		handler: ({ entity }) => {
			return registry.destroy({ entity });
		},
	});
	return system
}