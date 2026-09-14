import type { Config } from 'tailwindcss'

// Tailwind v4 uses CSS-based configuration (@theme in globals.css)
// This file is kept for compatibility with any tooling that reads it
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [],
}

export default config
