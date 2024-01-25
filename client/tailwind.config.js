/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                'pipelines-gray-100': '#F7F7F7',
                'pipelines-gray-500': '#444444',
                'pipeline-blue-200': '#0265AC',
            },
            animation: {
                'infinite-scroll': 'infinite-scroll 265s linear infinite',
            },
            keyframes: {
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-180%)' },
                },
            },
        },
    },
    plugins: [],
}
