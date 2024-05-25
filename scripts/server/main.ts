import ServerRegistry from "./ServerRegistry";
import WebSocketMessager from "./WebSocketMessager";

export const wsm = new WebSocketMessager();
export const serverEntityRegistry = new ServerRegistry(wsm);

wsm.addHandler('consoleMessages', (ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
