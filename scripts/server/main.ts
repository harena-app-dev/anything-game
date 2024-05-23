import EntityRegistry from "./EntityRegistry";
import WebSocketMessager from "./WebSocketMessager";
import fs from 'fs';
export const webSocketMessager = new WebSocketMessager();

export const entityRegistry = new EntityRegistry(webSocketMessager);

function registerHandlers() {
	// iterate files in ./handlers and register them
	//  each file default-exports a Handler
	// use the file name as the handler name

	const handlerFiles = fs.readdirSync(__dirname + '/handlers');
	for (const handlerFile of handlerFiles) {
		const handler = require(`./handlers/${handlerFile}`).default;
		webSocketMessager.addHandler(handlerFile, handler);
	}
	
}
registerHandlers();
webSocketMessager.addHandler('consoleMessages', (wsm, ws, _) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});