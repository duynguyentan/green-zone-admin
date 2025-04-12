export const apps = [
  {
    name: 'green-zone-admin',
    script: 'serve',
    args: '-s dist -l 5173',
    env: {
      NODE_ENV: 'production',
    },
  },
];
