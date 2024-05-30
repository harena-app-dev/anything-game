import * as three from 'three'
export default function ({ registry }) {
	this._scene = new three.Scene() 
	this._entitiesToThree = {}
	this._threeToEntities = {}
	this.getScene = function () {
		return this._scene
	}
	return this
}