// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-graphql-client', '@nuxtjs/tailwindcss'],
  css: [
    'plyr/dist/plyr.css'
  ],
  plugins: [
    { src: '~/plugins/tooltip.js' },
  ],

  'graphql-client': {
    clients: {
      default: {
        host: 'https://api.kala-vods.com/gql',
          headers: {
            'Client-ID': 'kalaplex',
          }
        }
      }
  }
})