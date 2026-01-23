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
let changesCount = 0;

files.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf-8');
    let originalContent = content;

    // Regex to capture import paths ending in .vue
    // Supports ' and "
    const importRegex = /(import\s+.*?from\s+['"])(.*?\.vue)(['"])|(import\s*\(['"])(.*?\.vue)(['"]\))/g;

    content = content.replace(importRegex, (match, p1, p2, p3, p4, p5, p6) => {
        const prefix = p1 || p4;
        const importPath = p2 || p5;
        const suffix = p3 || p6;

        // Check if it looks like .../Component/Component.vue
        const parts = importPath.split('/');
        const fileName = parts.pop(); // Component.vue
        const componentName = fileName.replace('.vue', '');
        const parentDir = parts.pop(); // Component (maybe)

        if (parentDir === componentName || parentDir === componentName) {
            // It matches the pattern .../X/X.vue
            // We want to check if it should be .../X/src/components/X.vue

            // Construct the "new" path injection
            // old: .../X/X.vue
            // new: .../X/src/components/X.vue

            // We only replace if "src/components" is NOT already there
            if (!parts.includes('src') && !parts.includes('components')) {
                // This is a heuristic. 
                // Ideally we resolve the path to see if it's valid.
                // But simpler: just inject src/components/

                const newPath = [...parts, parentDir, 'src', 'components', fileName].join('/');
                // Wait, parts popped parentDir already.
                // importPath was `.../KunBtn/KunBtn.vue`
                // parts is `...`
                // parentDir is `KunBtn`
                // fileName is `KunBtn.vue`

                // New path: `.../KunBtn/src/components/KunBtn.vue`
                const reassembled = [...parts, parentDir, 'src', 'components', fileName].join('/');

                console.log(`[Suggested Fix] in ${path.relative(rootDir, filePath)}: ${importPath} -> ${reassembled}`);
                return `${prefix}${reassembled}${suffix}`;
            }
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf-8');
        changesCount++;
        console.log(`Updated ${path.relative(rootDir, filePath)}`);
    }
});

console.log(`Finished. Updated ${changesCount} files.`);
