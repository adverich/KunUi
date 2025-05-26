/** @type {import('tailwindcss').Config} */
const safelist = require('./tailwind.safelist.js')

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/adverich-kun-ui/dist/**/*.js"
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                text: {
                    light: '#1f2937',
                    dark: '#f1f5f9',
                },
            }
        }
    },
    safelist,
    plugins: [
        addDynamicIconSelectors(),
    ]
}