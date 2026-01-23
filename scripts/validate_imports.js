import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(__filename), '../src');

function getAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    files.forEach(function (file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
        } else {
            if (file.endsWith('.js') || file.endsWith('.vue')) {
                arrayOfFiles.push(path.join(dirPath, "/", file));
            }
        }
    });
    return arrayOfFiles;
}

const files = getAllFiles(rootDir);

console.log('Scanning imports...');

const alias = {
    '@': rootDir
};

files.forEach(filePath => {
    const content = fs.readFileSync(filePath, 'utf-8');
    const importLines = content.matchAll(/(import\s+.*?from\s+['"])(.*?)(['"])|(import\s*\(['"])(.*?)(['"]\))/g);

    for (const match of importLines) {
        const importPath = match[2] || match[5];
        if (!importPath) continue;

        // Ignore packages
        if (!importPath.startsWith('.') && !importPath.startsWith('@/')) continue;

        // Resolve path
        let resolvedPath = '';
        if (importPath.startsWith('@/')) {
            resolvedPath = path.join(alias['@'], importPath.substring(2));
        } else {
            resolvedPath = path.resolve(path.dirname(filePath), importPath);
        }

        // Check extensions
        let exists = false;
        const extensions = ['', '.js', '.vue', '.json', '/index.js'];
        for (const ext of extensions) {
            if (fs.existsSync(resolvedPath + ext) && fs.statSync(resolvedPath + ext).isFile()) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            // Only report if it implies a component path
            console.log(`BROKEN IMPORT in ${path.relative(rootDir, filePath)}: ${importPath}`);

            // Try to autocorrect
            const basename = path.basename(importPath).replace(/\.(vue|js)$/, '');
            // Search for this basename in the project
            // Heuristic: If import was `../KunBtn/KunBtn.vue`, look for `KunBtn.vue`
            // If we find it at `.../KunBtn/src/components/KunBtn.vue`, we can suggest a fix.

            // This script just reports for now. A fix script is riskier.
        }
    }
});
