import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const exampleModules = import.meta.glob('../components/**/examples/*.vue')

export interface ExampleNavEntry {
    component: string;
    example: string;
    path: string;
    name: string;
}

/** @type {{ component: string, example: string, path: string, name: string }[]} */
export const exampleNav: ExampleNavEntry[] = []

const exampleRoutes = (Object.entries(exampleModules).map(([filePath, loader]) => {
  const match = filePath.match(/components\/([^/]+)\/examples\/([^/]+)\.vue$/)
  const component = match?.[1]
  const exampleFile = match?.[2]
  if (!component || !exampleFile) return null

  const isDefault = exampleFile === 'Default'
  const routePath = isDefault
    ? `/examples/${component}`
    : `/examples/${component}/${exampleFile}`
  const routeName = isDefault
    ? `example-${component}`
    : `example-${component}-${exampleFile}`

  exampleNav.push({
    component,
    example: exampleFile,
    path: routePath,
    name: routeName,
  })

  return {
    path: routePath,
    name: routeName,
    component: loader,
    meta: { component, example: exampleFile },
  }
}).filter(Boolean) as unknown as RouteRecordRaw[])

exampleNav.sort((a: ExampleNavEntry, b: ExampleNavEntry) => {
  const byComp = a.component.localeCompare(b.component)
  if (byComp !== 0) return byComp
  if (a.example === 'Default') return -1
  if (b.example === 'Default') return 1
  return a.example.localeCompare(b.example)
})

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../pages/ExamplesHome.vue'),
  },
  {
    path: '/sandbox',
    name: 'sandbox',
    component: () => import('../pages/Sandbox.vue'),
  },
  ...exampleRoutes,
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
