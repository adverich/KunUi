/**
 * KunUI - Vue.js 3 Component Library with Tailwind CSS
 * 
 * @package adverich-kun-ui
 * @documentation For AI agents documentation, see: AGENTS.md
 * 
 * @example
 * // Installation
 * npm install adverich-kun-ui
 * 
 * @example
 * // Global registration
 * import { createApp } from 'vue'
 * import KunUI from 'adverich-kun-ui'
 * import 'adverich-kun-ui/dist/adverich-kun-ui.css'
 * 
 * const app = createApp(App)
 * app.use(KunUI)
 * 
 * @example
 * // Individual component import
 * import { KunBtn, KunTextField, KunDialog } from 'adverich-kun-ui'
 */

import { defineAsyncComponent } from 'vue'
import './styles/style.css'
import './utils/utils.js'

// Config global
import { kunConfig, KUN_CONFIG_KEY } from './config/kunConfig.js'

// Asíncrono para uso manual
const asyncModules = import.meta.glob('./components/**/src/components/*.vue');

function extractComponentName(path) {
  return path.split('/').at(-1).replace('.vue', '');
}

// 1. Carga asincrónica para registro bajo demanda
export const components = Object.fromEntries(
  Object.entries(asyncModules).map(([path, comp]) => {
    const name = extractComponentName(path);
    return [name, defineAsyncComponent(comp)];
  })
);

// Registro global
export function install(app, options = {}) {
  const { skipIfRegistered = true, config = {} } = options;

  // Aplicar configuración global si se proporciona
  if (Object.keys(config).length > 0) {
    kunConfig.configure(config);
  }

  // Proveer config a toda la app para injection
  app.provide(KUN_CONFIG_KEY, kunConfig.current);

  const allComponents = import.meta.glob('./components/**/src/components/*.vue', { eager: true });

  Object.entries(allComponents).forEach(([path, component]) => {
    const name = extractComponentName(path);
    if (!skipIfRegistered || !app._context.components[name]) {
      app.component(name, component.default);
    }
  });
}

export * from 'virtual:kun-ui/auto-exports';

// Exportar config para uso externo
export { kunConfig, useKunConfig, resolveConfigValue } from './config/kunConfig.js';
export { kunDocumentConfig } from './config/kunDocumentConfig.js';

// 4. Exportación por defecto
export default {
  install,
  ...components
};