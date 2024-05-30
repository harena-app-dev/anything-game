
import Registry from "../Registry";
import * as commonSystems from "../systems/index.auto.js";
import * as serverSystems from "../systems/server/index.auto.js";
import * as THREE from "three";
import Systems from "../Systems";
export const registry = Registry();
const systems = new Systems({
	constructors: { ...commonSystems, ...serverSystems },
	registry,
});
// const serverSystem = Server({ registry });
// const worldGenSystem = WorldGen({ registry });
// const scene = new THREE.Scene();
// const spriteRenderer = SpriteRenderer({ registry, scene });

function tick() {
	systems.tick();
}
setInterval(tick, 1000 / 60);