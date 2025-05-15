const { addDynamicIconSelectors } = require('@iconify/tailwind');
/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/adverich-kun-ui/dist/**/*.js"
    ],
    safelist: [
        'ml-auto',
        'mr-auto',
        'flex',
        'justify-end',
        'items-center',
        'text-left',
        'text-center',
        'text-right',
        'truncate',
        'overflow-hidden',
        'whitespace-nowrap',
        'px-1', 'px-2', 'px-3', 'px-4',
        'py-1', 'py-2', 'py-3', 'py-4',
        'text-xs', 'text-sm', 'text-base',
        'rounded', 'rounded-lg', 'rounded-full',
        'bg-blue-500', 'bg-red-800', 'bg-red-900', 'text-white', 'text-gray-800',
        'opacity-50', 'cursor-not-allowed',
        'hover:opacity-90', 'focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2',
        'active:scale-[.98]', 'transition', 'duration-100', 'ease-in-out'
    ],
    plugins: [
        addDynamicIconSelectors(),
    ]
}