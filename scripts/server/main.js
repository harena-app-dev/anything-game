
import Registry from "../Registry";
import * as commonSystems from "../systems/index.auto.js";
import * as serverSystems from "../systems/server/index.auto.js";
import Systems from "../Systems";
export const registry = Registry();
const systems = new Systems({
	constructors: { ...commonSystems, ...serverSystems },
	registry,
});
function tick() {
	systems.tick();
}
setInterval(tick, 1000 / 60);