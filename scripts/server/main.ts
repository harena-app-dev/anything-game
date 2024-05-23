import EntityRegistry from "./EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";
import fs from 'fs';
export const webSocketMessager = new WebSocketMessager();

export const entityRegistry = new EntityRegistry(webSocketMessager);

function registerHandlers() {
	const handlerFileNames = fs.readdirSync(__dirname + '/handlers');
	for (const handlerFileName of handlerFileNames) { 
		const handlerName = handlerFileName.split('.')[0];
		console.log(`Registering handler: ${handlerName}`);
		const handler = require(`./handlers/${handlerFileName}`).default;
		webSocketMessager.addHandler(handlerName, handler);
	}
	
}
registerHandlers();
webSocketMessager.addHandler('consoleMessages', (wsm, ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});