import WebSocketMessager from "../WebSocketMessager";
import { entityRegistry } from "../main";

export default function (wsm: WebSocketMessager, ws: WebSocket, data: any) {
	const id = entityRegistry.create(data);
	wsm.send(ws, 'newMessage', `Created entity with id: ${id}`);
}