import WebSocketMessager from "../../WebSocketMessager";

export default function (registry, systems) {
	this.tick = function () {
	}
	this.destructor = function () {
	}
	const wsm= new WebSocketMessager()
	this.getWsm = function () {
		return wsm;
	}

}