import WebSocketMessager from "../WebSocketMessager";
import ExpressMessager from "../ExpressMessager";
export default function ({ registry }) {
	const system = {
		wsm: WebSocketMessager({ port: 3001 }),
		em: ExpressMessager({ port: 3002 }),
	}
	registry.onCreate.connect(function ({ entity }) {
		system.wsm.sendToAll("create", { entity })
	})
	registry.onEmplaceAny.connect(function ({ entity, component, type }) {
		system.wsm.sendToAll("emplace", { entity, component, type })
	})
	registry.onUpdateAny.connect(function ({ entity, component, type }) {
		system.wsm.sendToAll("update", { entity, component, type })
	})
	registry.onErase.connect(function ({ entity, type }) {
		system.wsm.sendToAll("erase", { entity, type })
	})
	registry.onDestroy.connect(function ({ entity }) {
		system.wsm.sendToAll("destroy", { entity })
	})
	system.em.setHandler({
		name: 'toJson',
		handler: () => {
			return registry.toJson();
		},
	});
	return system
}