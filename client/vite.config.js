export default {
  base: '/ai-consultant/',
  server: {
    proxy: {
      '/ai-consultant/login': 'http://localhost:3001',
      '/ai-consultant/paper': 'http://localhost:3001',
      '/ai-consultant/api': 'http://localhost:3001',
      '/api': 'http://localhost:3001',
    },
  },
};
