import colors from 'vuetify/es5/util/colors'

export default {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs:{
      lang:"ja"
    },
    titleTemplate: '%s - ' + "注目点を書き込めるサイト",
    title: "書き込み注目点",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },

      { hid: 'og:site_name', property: 'og:site_name', content: '書き込み注目点' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:url', property: 'og:url', content: 'https://kakikomi-tyumokuten.vercel.app/' },
      { hid: 'og:title', property: 'og:title', content: '画像に注目ポイントを書き込むサイト' },
      { hid: 'og:description', property: 'og:description', content: '画像に四角形を書き込める' },
      { hid: 'og:image', property: 'og:image', content: 'https://kakikomi-tyumokuten.vercel.app/ogp_image.png' },
      { name: 'twitter:card', content: 'summary' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/favicon-kakikomi-tyumokuten.png' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~plugins/ga.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
