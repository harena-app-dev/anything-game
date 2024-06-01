import WebSocketMessager from "@/scripts/client/WebSocketMessager"

export default function (registry, systems) {
	this.wsm = new WebSocketMessager()
	this.tick = function () {
	}
	this.destructor = function () {
	}
}