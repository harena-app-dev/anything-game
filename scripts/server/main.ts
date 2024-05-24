import Registry from "../Registry";
import ServerRegistry from "./ServerRegistry";
import WebSocketMessager from "./WebSocketMessager";
import fs from 'fs';
export const wsm = new WebSocketMessager();

const entityRegistry = new Registry();
export const serverEntityRegistry = new ServerRegistry(wsm);

function registerHandlers() {
	const handlerFileNames = fs.readdirSync(__dirname + '/handlers');
	for (const handlerFileName of handlerFileNames) { 
		const handlerName = handlerFileName.split('.')[0];
		console.log(`Registering handler: ${handlerName}`);
		const handler = require(`./handlers/${handlerFileName}`).default;
		wsm.addHandler(handlerName, handler);
	}
	
}
// registerHandlers();
wsm.addHandler('consoleMessages', (ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});