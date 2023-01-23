// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/image-edge', 'nuxt-graphql-client', '@nuxtjs/tailwindcss'],
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
                    serverOnly: {
                        'Client-ID': 'kalaplex'
                    }
                }
            }
        }
    },
    image: {
        domains: ['cdn.kala-vods.com' ,'data.kalathrasarchives.com', 'https://cdn.kala-vods.com']
      }
})