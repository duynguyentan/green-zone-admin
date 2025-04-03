export const apps = [
  {
    name: 'green-zone-admin-build',
    script: 'npm',
    args: 'run build', // Chạy build trước
    env: {
      NODE_ENV: 'production',
    },
    // Sau khi build xong, sẽ tự động chạy serve
    post_deploy: 'serve -s dist -l 4000',
  },
];
