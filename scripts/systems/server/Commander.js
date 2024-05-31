const { Command } = require('commander');
import Log from '../../Log';

export default function (registry, systems) {
	this._program = new Command();

	this._program
		.name('game')
		.description('CLI for game interactions')
		.version('0.8.0');

	this._program.command('observe')
		.description('Get a summary of your surroundings')
		.action(() => {
			Log.info("info You see a vast expanse of nothingness.");
			// registry.create("Message", { value: "You see a vast expanse of nothingness." });
			registry.emplace("Message", registry.create(), { value: "You see a vast expanse of nothingness." });
		});
	this._program.exitOverride();


	this.tick = function () {
	}
	this.destructor = function () {
	}
	registry.onEmplace("Message").connect((entity, message) => {
		console.log("Message: " + message.value);
		// if not start with /, then it is a message
		if (!message.value.startsWith("/")) {
			return;
		}
		try {
			// const args = message.value.split(" ");
			const args = ["", ""].concat(message.value.replace("/", "").split(" "));
			Log.info("info", "Command: ", args);
			this._program.parse((args)); // ["", "observe"
		} catch (err) {
			registry.emplace("Message", registry.create(), { value: this._program.helpInformation() });

			// custom processing...
			Log.info("parse error", err);
		}
	});
}