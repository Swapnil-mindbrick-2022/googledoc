import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import dotenv from 'dotenv';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
   // Enable environment variable loading from .env files
   envDir: './src/',
})
