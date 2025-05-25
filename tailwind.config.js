/** @type {import('tailwindcss').Config} */
const safelist = require('./tailwind.safelist.js')

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/adverich-kun-ui/dist/**/*.js"
    ],
    theme: {
        extend: {}
    },
    safelist,
    plugins: [
        addDynamicIconSelectors(),
    ]
}