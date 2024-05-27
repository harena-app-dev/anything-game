
import WebSocketMessager from "./WebSocketMessager";
import { NetworkedRegistry } from "../NetworkedRegistry";
import ExpressMessager from "./ExpressMessager";

export const wsm = WebSocketMessager({ port: 3001 });
export const em = ExpressMessager({ port: 3002 });
export const registry = NetworkedRegistry();
registry.onCreate.connect(({ entity }) => {
	wsm.sendToAll('newMessage', `Entity ${entity} created`);
});
registry.connect({ wsm, isClient: false, em });

wsm.addHandler('consoleMessages', ({ ws, _ }) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
