import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '../src/components');

const components = fs.readdirSync(rootDir).filter(f => fs.statSync(path.join(rootDir, f)).isDirectory());

components.forEach(comp => {
    const componentDir = path.join(rootDir, comp);
    const indexFile = path.join(componentDir, 'index.js');

    // We expect the vue file to be at src/components/CompName.vue
    const expectedVuePath = path.join(componentDir, 'src', 'components', `${comp}.vue`);

    // Check if Vue file exists there
    if (!fs.existsSync(expectedVuePath)) {
        console.error(`MISSING VUE FILE: ${expectedVuePath}`);
        // Try to find it?
        return;
    }

    const correctImportPath = `./src/components/${comp}.vue`;

    const indexContent = `import ${comp} from '${correctImportPath}';

export { ${comp} };
export default ${comp};
`;

    // Only overwrite if different or if we want to enforce consistency (yes we do)
    fs.writeFileSync(indexFile, indexContent, 'utf-8');
    console.log(`Fixed index.js for ${comp}`);
});
