// import NetworkedRegistry from "../NetworkedRegistry";
import WebSocketMessager from "./WebSocketMessager";
import { createNetworkedRegistry } from "../createNetworkedRegistry";
import fs from 'fs';
import path from 'path';
export const wsm = new WebSocketMessager();
// export const serverEntityRegistry = new NetworkedRegistry();
export const serverEntityRegistry = createNetworkedRegistry();
serverEntityRegistry.connect({ wsm, isClient: false });

export function recursivelyIterateDirectory(directory, callback) {
	console.log(`directory: ${directory}`);
	const files = fs.readdirSync(directory);
	files.forEach(file => {
		const filePath = path.join(directory, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			recursivelyIterateDirectory(filePath, callback);
		} else {
			callback({filePath});
		}
	});
}

recursivelyIterateDirectory(`${__dirname}/components`, ({filePath}) => {
	console.log(`component: ${filePath}`);
});

wsm.addHandler('consoleMessages', ({ws, _}) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
