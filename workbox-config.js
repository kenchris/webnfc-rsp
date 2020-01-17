module.exports = {
  globDirectory: ".",
  globPatterns: [
    "**/*.{html,js,png}",
    "manifest.json"
  ],
  globIgnores: ['**/*config.js', 'node_modules/**/*'],
  swDest: "sw.js",
  runtimeCaching: [
    {
      // Google fonts
      urlPattern: new RegExp('https://fonts.'),
      handler: 'CacheFirst',
      options: {
        cacheName: 'fonts'
      }
    }
  ]
};