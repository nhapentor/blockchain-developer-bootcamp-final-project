module.exports = {
  webpack: (config, { buildId, dev, isServer }) => {
    // This allows the app to refer to files through our symlink
    config.resolve.symlinks = false

    if (!isServer) {
      // don't resolve 'fs' module on the client to prevent this error on build --> Error: Can't resolve 'fs'
      config.resolve.fallback = {
          fs: false, stream: false, crypto: false, querystring: false, http: false, https: false, os: false, zlib: false, path: false
      }
  }
    return config
  },
  i18n: {
    // These are all the locales you want to support in
    // your application
    locales: ['en'],
    // This is the default locale you want to be used when visiting
    // a non-locale prefixed path e.g. `/hello`
    defaultLocale: 'en',
  }
}
