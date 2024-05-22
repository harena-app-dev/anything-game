import EntityRegistry from "./EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";

export const webSocketMessager = new WebSocketMessager();

export const entityRegistry = new EntityRegistry();

export default function main() {
	webSocketMessager.addHandler('consoleMessages', (wsm, ws, _) => {
		wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
	});
} 