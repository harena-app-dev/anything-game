
import WebSocketMessager from "./WebSocketMessager";
import { NetworkedRegistry } from "../NetworkedRegistry";
import ExpressMessager from "./ExpressMessager";
import SpriteRenderer from "../systems/SpriteRenderer";
import * as THREE from "three";
export const wsm = WebSocketMessager({ port: 3001 });
export const em = ExpressMessager({ port: 3002 });
export const registry = NetworkedRegistry();
registry.onCreate.connect(({ entity }) => {
	wsm.sendToAll('newMessage', `Entity ${entity} created`);
});
registry.connect({ wsm, isClient: false, em });
const scene = new THREE.Scene();
const spriteRenderer = SpriteRenderer({ registry, scene });

function tick() {
	spriteRenderer.onRender(); 
}
// setInterval(tick, 1000 / 60);