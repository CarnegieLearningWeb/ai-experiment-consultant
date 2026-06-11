export default {
  base: '/ai-consultant/',
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
};
