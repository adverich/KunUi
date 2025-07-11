import fs from 'fs';
import path from 'path';

export default function kunUiAutoExportsPlugin({
    componentsPath = 'src/components',
    virtualId = 'virtual:kun-ui/auto-exports'
} = {}) {
    const resolvedVirtualId = '\0' + virtualId;

    return {
        name: 'vite-plugin-kun-ui-auto-exports',
        resolveId(id) {
            if (id === virtualId) return resolvedVirtualId;
        },
        load(id) {
            if (id === resolvedVirtualId) {
                const fullPath = path.resolve(process.cwd(), componentsPath);
                const dirs = fs.readdirSync(fullPath);

                const exports = dirs
                    .filter(dir => {
                        const vuePath = path.join(fullPath, dir, 'src/components', `${dir}.vue`);
                        return fs.existsSync(vuePath);
                    })
                    .map(dir => {
                        return `export { default as ${dir} } from '/${componentsPath}/${dir}/src/components/${dir}.vue';`;
                    })
                    .join('\n');

                return exports;
            }
        }
    };
}
