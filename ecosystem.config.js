module.exports = {
  apps: [
    {
      name: 'green-zone-admin',
      script: 'node_modules/.bin/serve', // Dùng serve để chạy static files
      args: '-s dist -l 3000', // -s: serve static, -l: port
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
