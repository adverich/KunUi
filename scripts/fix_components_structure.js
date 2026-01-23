import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const componentsDir = path.resolve(__dirname, '../src/components');

if (!fs.existsSync(componentsDir)) {
    console.error('Components directory not found:', componentsDir);
    process.exit(1);
}

const components = fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

console.log(`Found ${components.length} components.`);

components.forEach(componentName => {
    const componentPath = path.join(componentsDir, componentName);
    const vueFileAtRoot = path.join(componentPath, `${componentName}.vue`);
    const targetDir = path.join(componentPath, 'src', 'components');
    const targetVueFile = path.join(targetDir, `${componentName}.vue`);

    // 1. Move Vue file if it exists at root
    if (fs.existsSync(vueFileAtRoot)) {
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.renameSync(vueFileAtRoot, targetVueFile);
        console.log(`Moved ${componentName}.vue to src/components/`);
    } else {
        // Check if it's already in the right place, if not, maybe it's missing?
        if (!fs.existsSync(targetVueFile)) {
            console.warn(`WARNING: ${componentName}.vue not found in root OR target dir.`);
        }
    }

    // 2. Fix index.js
    const indexFile = path.join(componentPath, 'index.js');
    if (fs.existsSync(indexFile)) {
        let content = fs.readFileSync(indexFile, 'utf-8');
        let modified = false;

        // Check strict import match patterns
        // We want: import X from './src/components/X.vue'

        // Case A: import X from './X.vue' -> import X from './src/components/X.vue'
        const wrongImport1 = `'./${componentName}.vue'`;
        const wrongImport2 = `".${path.sep}${componentName}.vue"`.replace(/\\/g, '/'); // normalize for check
        const wrongImport3 = `"./${componentName}.vue"`;

        const correctImport = `'./src/components/${componentName}.vue'`;
        // We'll just generic replace string literals

        if (content.includes(wrongImport1)) {
            content = content.replace(wrongImport1, correctImport);
            modified = true;
        }
        if (content.includes(wrongImport3)) {
            content = content.replace(wrongImport3, correctImport);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(indexFile, content, 'utf-8');
            console.log(`Updated index.js for ${componentName}`);
        }
    } else {
        console.warn(`WARNING: index.js not found for ${componentName}`);
    }
});
