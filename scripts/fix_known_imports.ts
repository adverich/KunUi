import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '../src');

function getAllFiles(dirPath: string, arrayOfFiles?: string[]): string[] {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file: string) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.ts') || file.endsWith('.vue')) {
                arrayOfFiles!.push(path.join(dirPath, "/", file));
            }
        }
    });

    return arrayOfFiles;
}

const files = getAllFiles(rootDir);
let updated = 0;

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // 1. Fix examples importing ../Component.vue
    if (filePath.includes('examples') && filePath.endsWith('.vue')) {
        const parentDir = path.basename(path.dirname(path.dirname(filePath))); // e.g. KunBtn from .../KunBtn/examples/Default.vue

        // Regex: import X from '../KunBtn.vue'
        // Replace with: import X from '../src/components/KunBtn.vue'

        const regex = new RegExp(`from\\s+['"]\\.\\./${parentDir}\\.vue['"]`, 'g');
        content = content.replace(regex, `from '../src/components/${parentDir}.vue'`);
    }

    // 2. Fix specific index.ts issues found
    if (filePath.endsWith('KunInfiniteScroll/src/index.ts') || filePath.endsWith('KunInfiniteScroll/src/index.ts')) {
        content = content.replace("from './src/components/KunInfiniteScroll.vue'", "from './components/KunInfiniteScroll.vue'");
        content = content.replace("from './src/composables/useKunInfiniteScroll'", "from './composables/useKunInfiniteScroll'");
    }

    if (filePath.endsWith('KunMenu/index.ts') || filePath.endsWith('KunMenu/index.ts')) {
        // Detected: ./components/KunMenu.vue -> ./src/components/KunMenu.vue
        content = content.replace("from './components/KunMenu.vue'", "from './src/components/KunMenu.vue'");
    }

    if (filePath.endsWith('KunNumberField/index.ts') || filePath.endsWith('KunNumberField/index.ts')) {
        // Detected: ./composables/useKunNumberFieldComposable.js -> ./src/composables/useKunNumberFieldComposable.js
        content = content.replace("from './composables/useKunNumberFieldComposable.js'", "from './src/composables/useKunNumberFieldComposable.js'");
    }

    if (filePath.endsWith('KunTextField/index.ts') || filePath.endsWith('KunTextField/index.ts')) {
        content = content.replace("from './composables/useKunTextField.js'", "from './src/composables/useKunTextField.js'");
    }

    // 3. General fix for ../Component.vue in other files?
    // Use caution. The examples one is safe because verify structure.

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed ${path.relative(rootDir, filePath)}`);
        updated++;
    }
});

console.log(`Fixed ${updated} files.`);
