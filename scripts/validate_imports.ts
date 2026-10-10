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

console.log('Scanning imports...');

const alias: Record<string, string> = {
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

        // Check extensions ('.js' suffixed imports resolve to '.ts' via bundler resolution)
        let exists = false;
        const candidates = [resolvedPath];
        if (resolvedPath.endsWith('.js')) {
            candidates.push(resolvedPath.replace(/\.js$/, '.ts'));
        }
        const extensions = ['', '.ts', '.js', '.vue', '.json', '/index.ts', '/index.js'];
        for (const base of candidates) {
            for (const ext of extensions) {
                if (fs.existsSync(base + ext) && fs.statSync(base + ext).isFile()) {
                    exists = true;
                    break;
                }
            }
            if (exists) break;
        }

        if (!exists) {
            // Only report if it implies a component path
            console.log(`BROKEN IMPORT in ${path.relative(rootDir, filePath)}: ${importPath}`);

            // Try to autocorrect
            const basename = path.basename(importPath).replace(/\.(vue|ts|js)$/, '');
            // Search for this basename in the project
            // Heuristic: If import was `../KunBtn/KunBtn.vue`, look for `KunBtn.vue`
            // If we find it at `.../KunBtn/src/components/KunBtn.vue`, we can suggest a fix.

            // This script just reports for now. A fix script is riskier.
        }
    }
});
