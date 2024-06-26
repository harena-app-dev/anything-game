import Log from '../../log.js';
import Observable from '@/scripts/Observable.js';
export default function () {
	this._keys = {};
	Log.debug(`KeyboardState`);
	this.keyDownObservable = new Observable();
	const onKeyDown = (e) => {
		Log.debug(`keydown ${e.key}`);
		this._keys[e.key.toLowerCase()] = true;
		this.keyDownObservable.notify(e.key);
	}

	window.addEventListener('keydown', onKeyDown);
	const onKeyUp = (e) => {
		Log.debug(`keyup ${e.key}`);
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
		Log.debug(`KeyboardState.destructor`);
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
	}
	Log.debug(`KeyboardState end`);
}