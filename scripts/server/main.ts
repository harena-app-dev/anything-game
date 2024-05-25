import NetworkedRegistry from "../NetworkedRegistry";
import WebSocketMessager from "./WebSocketMessager";

export const wsm = new WebSocketMessager();
export const serverEntityRegistry = new NetworkedRegistry();
serverEntityRegistry.connect(wsm);

wsm.addHandler('consoleMessages', (ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
