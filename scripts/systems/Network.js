import WebSocketMessager from "./WebSocketMessager";
import ExpressMessager from "./ExpressMessager";
export default function ({ registry, scene }) {
	const system = {
		wsm: WebSocketMessager({ port: 3001 }),
		em: ExpressMessager({ port: 3002 }),
		onEmplaceAny: function ({ entity, component, type }) {

		}
	}
	registry.onEmplaceAny.connect(system.onEmplaceAny.bind(onEmplaceAny))
	return system
}