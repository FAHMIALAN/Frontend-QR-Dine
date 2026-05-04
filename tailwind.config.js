/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: "#16A34A",    // Hijau GoFood (Segar)
        "primary-dark": "#15803d",
        secondary: "#F97316",  // Oranye (Selera Makan)
        "secondary-dark": "#ea580c",
        accent: "#22C55E",     // Hijau Terang
        warm: "#F9FAFB",       // Soft White (Dasar Bersih)
        surface: "#FFFFFF",
      }
    },
  },
  plugins: [],
}

