/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Cần đảm bảo quét đúng thư mục chứa file đang dùng Tailwind
  ],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'], // Khai báo đúng font
        outfit: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
