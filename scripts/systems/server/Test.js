export default function (registry, systems) {
	this.tick = function () {
		registry.view('Position').each((entity, position) => {
			position.x += 0.01;
			registry.replace('Position', entity, position);
		});
	}
	this.destructor = function () {
	}
}