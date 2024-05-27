import fs from 'fs';
import path from 'path';
function indexAllComponents() {
	const componentFiles = fs.readdirSync("scripts/components")
	let indexFileString = '';
	for (let componentFile of componentFiles) {
		if (componentFile[0].toLowerCase() === componentFile[0]) {
			continue;
		}
		indexFileString += `export { ${componentFile.replace('.js', '')} } from './${componentFile}';\n`;
	}
	fs.writeFileSync('scripts/components/index.auto.js', indexFileString)
}	
indexAllComponents();