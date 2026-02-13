/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    500: '#6366f1', // Indigo 500
                    600: '#4f46e5', // Indigo 600
                    700: '#4338ca',
                    800: '#3730a3',
                    900: '#312e81',
                },
                secondary: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981', // Emerald 500
                    600: '#059669',
                    700: '#047857',
                },
                dark: {
                    800: '#1e293b', // Slate 800
                    900: '#0f172a', // Slate 900
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
