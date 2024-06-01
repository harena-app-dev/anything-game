import Log from '../Log.js';
import BaseWebSocketMessager from '../WebSocketMessager.js';
export default function WebSocketMessager(server) {
	return new BaseWebSocketMessager();
}