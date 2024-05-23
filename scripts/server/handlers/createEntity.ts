import WebSocketMessager from "../WebSocketMessager";
import { entityRegistry } from "../main";
import { Handler } from "../WebSocketMessager";
import WebSocket from "ws";

const createEntity: Handler = function (wsm: WebSocketMessager, ws: WebSocket, data: any) {
	const id = entityRegistry.create(data);
	wsm.send(ws, 'newMessage', `Created entity with id: ${id}`);
}

export default createEntity;