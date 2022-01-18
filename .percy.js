module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 1280],
    minHeight: 1024,
    percyCSS: '',
  },
  discovery: {
    allowedHostnames: ['fonts.gstatic.com', 'vercel.com'],
    networkIdleTimeout: 100,
  },
  static: {
    cleanUrls: false,
  },
  upload: {
    files: '**/*.{png,jpg,jpeg}',
    ignore: '',
    stripExtensions: false,
  },
}
