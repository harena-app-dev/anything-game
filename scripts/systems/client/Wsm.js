import WebSocketMessager from "../../WebSocketMessager";

export default function (registry, systems) {
	const wsm= new WebSocketMessager()
	this.getWsm = function () {
		return wsm;
	}
	this.tick = function () {
	}
	this.destructor = function () {
		wsm.close();
	}
}