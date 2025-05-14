const { addDynamicIconSelectors } = require('@iconify/tailwind');
/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
        "./node_modules/adverich-kun-ui/dist/**/*.js"
    ],
    plugins: [
        addDynamicIconSelectors(),
    ]
}