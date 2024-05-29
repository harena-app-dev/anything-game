
import ServerRegistry from "../ServerRegistry";
import SpriteRenderer from "../systems/SpriteRender";
import Server from "../systems/Server";
import * as THREE from "three";
export const registry = ServerRegistry();

const serverSystem = Server({ registry });
const scene = new THREE.Scene();
const spriteRenderer = SpriteRenderer({ registry, scene });

function tick() {
	spriteRenderer.onRender(); 
}
setInterval(tick, 1000 / 60);