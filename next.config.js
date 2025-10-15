/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features

module.exports = {
  trailingSlash: true,
  reactStrictMode: false,
  output: 'export',
  images: { unoptimized: true },

  // Limit static export to known safe routes (extend as needed)
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/login': { page: '/login' },
      '/404': { page: '/404' },
      '/401': { page: '/401' },
      '/500': { page: '/500' },
      // CMS
      '/cms/industries': { page: '/cms/industries' }
    }
  },

  webpack: config => {
    config.resolve.alias = {
      ...config.resolve.alias,
      apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
    }

    return config
  }
}
