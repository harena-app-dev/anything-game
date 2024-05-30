export default function SystemGraph({
	systemNamesToFunction,
}) {
	this.systemNamesToSystems = {};
	for (let [name, constructor] of Object.entries(systemNamesToFunction)) {
		this.systemNamesToSystems[name] = constructor();
	}
}