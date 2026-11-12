/**
 * Carga perezosa del runtime de íconos (`@iconify/vue`).
 *
 * - `ensureKunIcons()` importa `@iconify/vue` una sola vez, registra el
 *   subconjunto `lucide` propio de la librería (`addCollection`) y devuelve el
 *   componente `Icon`. Los íconos propios no tocan la red.
 * - `preloadKunIcons()` precalienta la carga (chunk aparte) desde
 *   `install()` para evitar parpadeo en el primer render.
 * - `registerKunIcons()` permite al consumidor registrar colecciones Iconify
 *   (`@iconify-json/*`) para resolver offline/SSR.
 */
import type { Component } from 'vue';
import type { IconifyJSON } from '@iconify/vue';
import { lucideSubset } from './lucide.generated.js';

type IconifyModule = typeof import('@iconify/vue');

let modulePromise: Promise<IconifyModule> | null = null;
let iconPromise: Promise<Component> | null = null;
let collectionRegistered = false;

function loadModule(): Promise<IconifyModule> {
  if (!modulePromise) {
    modulePromise = import('@iconify/vue').then((mod) => {
      if (!collectionRegistered) {
        collectionRegistered = true;
        try {
          mod.addCollection(lucideSubset);
        } catch {
          /* colección ya registrada u host incompatible: se ignora */
        }
      }
      return mod;
    });
  }
  return modulePromise;
}

/** Resuelve el componente `Icon` de `@iconify/vue` (cargando y registrando el subset propio). */
export function ensureKunIcons(): Promise<Component> {
  if (!iconPromise) {
    iconPromise = loadModule().then((mod) => mod.Icon as Component);
  }
  return iconPromise;
}

/** Dispara la carga en segundo plano (sin await). No-op si ya está cargado. */
export function preloadKunIcons(): void {
  void ensureKunIcons().catch(() => {
    /* sin `@iconify/vue`: los íconos Iconify quedan no-op */
  });
}

/** Registra una o varias colecciones Iconify (`@iconify-json/*`) para uso offline. */
export async function registerKunIcons(collections: IconifyJSON | IconifyJSON[]): Promise<void> {
  const mod = await loadModule();
  for (const data of Array.isArray(collections) ? collections : [collections]) {
    try {
      mod.addCollection(data);
    } catch {
      /* colección inválida o ya registrada */
    }
  }
}
