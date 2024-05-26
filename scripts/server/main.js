// import NetworkedRegistry from "../NetworkedRegistry";
import WebSocketMessager from "./WebSocketMessager";
import { createNetworkedRegistry } from "../createNetworkedRegistry";
import fs from 'fs';
import path from 'path';
import { register } from "module";
export const wsm = new WebSocketMessager();
// export const serverEntityRegistry = new NetworkedRegistry();
export const registry = createNetworkedRegistry();
registry.connect({ wsm, isClient: false });

export function recursivelyIterateDirectory(directory, callback) {
	console.log(`directory: ${directory}`);
	const files = fs.readdirSync(directory);
	files.forEach(file => {

		const filePath = path.join(directory, file);
		const stat = fs.statSync(filePath);
		if (stat.isDirectory()) {
			recursivelyIterateDirectory(filePath, callback);
		} else {
			callback({ filePath, file });
		}
	});
}
const registeredComponents = {
	components: []
};
recursivelyIterateDirectory(`${__dirname}/components`, ({ filePath, file }) => {
	if (!file.endsWith('.js')) {
		return;
	}
	registeredComponents.components.push(file.replace('.js', ''));
});

registry.emplace({ type: `RegisteredComponents`, entity: registry.create(), component: registeredComponents });


wsm.addHandler('consoleMessages', ({ ws, _ }) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
