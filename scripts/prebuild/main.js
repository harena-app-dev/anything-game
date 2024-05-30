import fs from 'fs';
function index(path) {
	const componentFiles = fs.readdirSync(`${path}`)
	let indexFileString = '';
	for (let componentFile of componentFiles) {
		if (componentFile[0].toLowerCase() === componentFile[0]) {
			continue;
		}
		indexFileString += `import ${componentFile.replace('.js', '')} from './${componentFile}';\n`;
		indexFileString += `export { ${componentFile.replace('.js', '')} };\n`;
	}
	fs.writeFileSync(`${path}/index.auto.js`, indexFileString)
}	
index('scripts/components');
index('scripts/systems');
index('scripts/systems/client');
index('scripts/systems/server');