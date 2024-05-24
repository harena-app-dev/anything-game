
export enum EntityType {
	Creature = "Creature",
	Inanimate = "Inanimate",
}
export default class Entity {
	type: EntityType;
	constructor(type: EntityType) {
		this.type = type;
	}
}