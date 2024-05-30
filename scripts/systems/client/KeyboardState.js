import Log from '../../Log.js';
export default function KeyboardState() {
	this._keys = {};
	Log.info(`KeyboardState`);
	const onKeyDown = (e) => {
		Log.info(`keydown ${e.key}`);
		this._keys[e.key.toLowerCase()] = true;
	}
	window.addEventListener('keydown', onKeyDown);
	const onKeyUp = (e) => {
		Log.info(`keyup ${e.key}`);
		this._keys[e.key.toLowerCase()] = false;
	}
	window.addEventListener('keyup', onKeyUp);

	this.isKeyDown = function(key) {
		const state = this._keys[key.toLowerCase()];
		if (state === undefined) {
			return 0;
		}
		return state ? 1 : 0;
	}
	this.destructor = function() {
		Log.info(`KeyboardState.destructor`);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	}
	Log.info(`KeyboardState end`);
	return this;
}