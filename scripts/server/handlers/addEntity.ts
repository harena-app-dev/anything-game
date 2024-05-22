import { entityRegistry } from "../main";

export default function (ws: WebSocket, data: any) {
	const id = entityRegistry.create(data);
	ws.send(JSON.stringify({ id }));
}