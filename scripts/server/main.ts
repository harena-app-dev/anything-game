import Registry from "../Registry";
import ServerRegistry from "./ServerRegistry";
import WebSocketMessager from "./WebSocketMessager";
import fs from 'fs';
export const wsm = new WebSocketMessager();

const entityRegistry = new Registry();
export const serverEntityRegistry = new ServerRegistry(wsm);

wsm.addHandler('consoleMessages', (ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
