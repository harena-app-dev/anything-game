// import NetworkedRegistry from "../NetworkedRegistry";
import WebSocketMessager from "./WebSocketMessager";
import { createNetworkedRegistry } from "../createNetworkedRegistry";
export const wsm = new WebSocketMessager();
// export const serverEntityRegistry = new NetworkedRegistry();
export const serverEntityRegistry = createNetworkedRegistry();
serverEntityRegistry.connect({ wsm, isClient: false });

wsm.addHandler('consoleMessages', ({ws, _}) => {
	wsm.send(ws, 'consoleMessages', ['Hello from server', 'Hello from server 2']);
});
