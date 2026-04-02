import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '',
// base: '/PhysicsSims/' // Uncomment this line when deploying to GitHub Pages 
});
