export class IntegrityAttributes {
	armorClass: number = 0;
	hitPoints: number = 0;
}
export class SkillAttributes {
	strength: number = 0;
	dexterity: number = 0;
	constitution: number = 0;
	intelligence: number = 0;
	wisdom: number = 0;
	charisma: number = 0;
}
export default class Entity {
	skillAttributes: SkillAttributes = new SkillAttributes();
	integrityAttributes: IntegrityAttributes = new IntegrityAttributes();
	constructor() {
	}
}