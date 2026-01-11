import { ref, computed } from 'vue'

const isClient = typeof window !== 'undefined'

// Detectar el sistema operativo
function getOS() {
    if (!isClient) {
        return { os: 'Server', osVersion: 'Unknown' }
    }
    const userAgent = window.navigator.userAgent
    let os = 'Unknown OS', osVersion = 'Unknown Version'

    if (/Mac/.test(userAgent)) {
        os = 'Mac OS'
        osVersion = userAgent.match(/Mac OS X (\d+[\._]\d+[\._]\d+)/)?.[1]?.replace(/_/g, '.')
    } else if (/iPhone|iPad|iPod/.test(userAgent)) {
        os = 'iOS'
        osVersion = userAgent.match(/OS (\d+)[._](\d+)[._]?(\d+)?/)?.slice(1, 4).join('.') || 'Unknown'
    } else if (/Windows/.test(userAgent)) {
        os = 'Windows'
        osVersion = userAgent.match(/Windows NT (\d+\.\d+)/)?.[1]
    } else if (/Android/.test(userAgent)) {
        os = 'Android'
        osVersion = userAgent.match(/Android (\d+\.\d+)/)?.[1]
    } else if (/Linux/.test(userAgent)) {
        os = 'Linux'
    }

    return { os, osVersion }
}

// Variables reactivas
const screenWidth = ref(isClient ? window.innerWidth : 1024)
const screenHeight = ref(isClient ? window.innerHeight : 768)
const kunOS = getOS()

const isMobile = computed(() =>
    kunOS.os === 'iOS' || kunOS.os === 'Android' || screenHeight.value > screenWidth.value
)

// Breakpoints basados en Tailwind (xs, sm, md, lg, xl, xxl)
const breakpoints = {
    xs: 475,
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    xxl: 1536,
}

// Computed properties para evaluar cada tamaño
const xs = computed(() => screenWidth.value < breakpoints.sm)
const sm = computed(() => screenWidth.value >= breakpoints.sm && screenWidth.value < breakpoints.md)
const md = computed(() => screenWidth.value >= breakpoints.md && screenWidth.value < breakpoints.lg)
const lg = computed(() => screenWidth.value >= breakpoints.lg && screenWidth.value < breakpoints.xl)
const xl = computed(() => screenWidth.value >= breakpoints.xl && screenWidth.value < breakpoints.xxl)
const xxl = computed(() => screenWidth.value >= breakpoints.xxl)

// Computed properties para rangos superiores e inferiores
const xsAndUp = computed(() => screenWidth.value >= breakpoints.xs)
const smAndUp = computed(() => screenWidth.value >= breakpoints.sm)
const mdAndUp = computed(() => screenWidth.value >= breakpoints.md)
const lgAndUp = computed(() => screenWidth.value >= breakpoints.lg)
const xlAndUp = computed(() => screenWidth.value >= breakpoints.xl)
const xxlAndUp = computed(() => screenWidth.value >= breakpoints.xxl)

const xsAndDown = computed(() => screenWidth.value < breakpoints.sm)
const smAndDown = computed(() => screenWidth.value < breakpoints.md)
const mdAndDown = computed(() => screenWidth.value < breakpoints.lg)
const lgAndDown = computed(() => screenWidth.value < breakpoints.xl)
const xlAndDown = computed(() => screenWidth.value < breakpoints.xxl)
const xxlAndDown = computed(() => screenWidth.value < breakpoints.xxl)

// Manejo de eventos de cambio de tamaño
function handleResize() {
    if (isClient) {
        screenWidth.value = window.innerWidth
        screenHeight.value = window.innerHeight
    }
}

if (isClient) {
    window.addEventListener('resize', handleResize)
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('resize', handleResize)
    })
}

export {
    kunOS, isMobile, screenWidth, screenHeight,
    xs, sm, md, lg, xl, xxl,
    xsAndUp, smAndUp, mdAndUp, lgAndUp, xlAndUp, xxlAndUp,
    xsAndDown, smAndDown, mdAndDown, lgAndDown, xlAndDown, xxlAndDown
}
