module.exports = {
  apps: [
    {
      name: 'green-zone-admin',
      script: 'npm', // Sử dụng npm để chạy lệnh build
      args: 'run build && serve -s dist -l 4000', // Build và serve static files
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
