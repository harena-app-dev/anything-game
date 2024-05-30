
import Registry from "../Registry";
import SpriteRenderer from "../systems/SpriteRender";
import Server from "../systems/Server";
import WorldGen from "../systems/WorldGen";
import * as THREE from "three";
export const registry = Registry();

const serverSystem = Server({ registry });
// const worldGenSystem = WorldGen({ registry });
// const scene = new THREE.Scene();
// const spriteRenderer = SpriteRenderer({ registry, scene });

function tick() {
	// spriteRenderer.onRender(); 
}
setInterval(tick, 1000 / 60);