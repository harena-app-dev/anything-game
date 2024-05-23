import WebSocketMessager from "../WebSocketMessager";
import { serverEntityRegistry } from "../main";
import { Handler } from "../WebSocketMessager";
import WebSocket from "ws";

const loadEntities: Handler = function (wsm: WebSocketMessager, ws: WebSocket, data: any) {
	serverEntityRegistry.sendTo(ws);
}

export default loadEntities;