import { createRouter, createWebHistory } from 'vue-router'

// Importar todos los ejemplos
const exampleModules = import.meta.glob('../components/**/examples/Default.vue')

// Generar rutas dinámicas
const exampleRoutes = Object.entries(exampleModules).map(([path, loader]) => {
    const match = path.match(/components\/([^/]+)\/examples\/Default\.vue$/)
    const name = match?.[1]

    return {
        path: `/examples/${name}`,
        name: `example-${name}`,
        component: loader
    }
})

// Ruta raíz
const routes = [
    {
        path: '/',
        component: { template: '<div>Bienvenido a KunUI</div>' }
    },
    ...exampleRoutes
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
