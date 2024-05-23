import WebSocketMessager from "../WebSocketMessager";
import { serverEntityRegistry } from "../main";
import { Handler } from "../WebSocketMessager";
import WebSocket from "ws";

const createEntity: Handler = function (wsm: WebSocketMessager, ws: WebSocket, {data}) {
	const id = serverEntityRegistry.create(data);
	wsm.send(ws, 'newMessage', `Created entity with id: ${id}`);
}

export default createEntity;