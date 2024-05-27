
import WebSocketMessager from "./WebSocketMessager";
import { NetworkedRegistry } from "../NetworkedRegistry";

export const wsm = WebSocketMessager();
export const registry = NetworkedRegistry();
registry.onCreate.connect(({ entity }) => {
	wsm.sendToAll('newMessage', `Entity ${entity} created`);
});
registry.connect({ wsm, isClient: false });

wsm.addHandler('consoleMessages', ({ ws, _ }) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
