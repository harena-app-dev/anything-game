import Attributes from "./Attributes";
export class SecondaryAttributes {
	armorClass: number = 0;
	hitPoints: number = 0;
	speed: number = 0;
	constructor() {
	}
}
export default class Entity {
	attributes?: Attributes;
	constructor() {
	}
}