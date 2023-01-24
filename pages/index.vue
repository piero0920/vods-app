<template>
    <div v-if="data.vodsQuery.vods.length">
      <div class="flex">
        <div class="flex-none w-10"></div>
          <div class="flex-1  grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-5 space-x-2">
            <div v-for="vod in data.vodsQuery.vods">
              <nuxt-link :to="`/${vod._id}`">
                <div class=" flex flex-col cursor-pointer transition ease-in-out delay-100 hover:shadow-lg hover:z-10	 hover:scale-110 duration-200" @mouseover="hovered = vod._id" @mouseleave="hovered = null" @touchstart="hovered = vod._id" @touchend="hovered = null" >
                  <div class=" relative flex flex-col">
                    <img @error="vod.previewURL = '/nonvod.jpg';vod.thumbnailURL= '/nonvod.jpg' " :src="hovered === vod._id ? vod.previewURL : vod.thumbnailURL">
                    <p class="absolute px-2 bg-black text-white bg-opacity-50 bottom-1 right-1">{{toHMS(vod.duration)}}</p>
                    <p class="absolute px-2 bg-black text-white bg-opacity-50 top-2 right-1 ">{{toDate(vod._id)}}</p>
                  </div>
                  <div class="flex p-2">
                    <p class="text-sm text-white truncate" v-tooltip="vod.title">{{vod.title}}</p>
                  </div>
                </div>
              </nuxt-link>
            </div>
            <div class="relative flex sm:col-span-1 md:col-span-2 lg:col-span-4 pb-10">
              <button @click="loadPage(data.vodsQuery.page-1)" class="w-[100px] h-12 md:w-24 md:h-8 lg:w-24 lg:h-8 absolute left-0 drop-shadow-2xl rounded-full bg-purple-900 hover:bg-purple-800 hover:scale-110 active:bg-purple-700">Previous</button>
              <p class="text-center text-white  w-full text-lg">Page: {{ data.vodsQuery.page }} / {{ data.vodsQuery.pages }}</p>
              <button @click="loadPage(data.vodsQuery.page+1)" class="w-[100px] h-12 md:w-24 md:h-8 lg:w-24 lg:h-8 absolute right-0 drop-shadow-2xl rounded-full bg-purple-900 hover:bg-purple-800 hover:scale-110 active:bg-purple-700">Next</button>
            </div>
          </div>
          <div class="flex-none w-10"></div>
      </div>
    </div>
    <div v-else>
      <p class="text-white text-center pt-20 text-2xl" >NO DATA IN PAGE.</p>
    </div>
  
  
  </template>
<script setup>
  useHead({
    title: "VODs",
    meta: [
      { name: 'description', content: 'Temporary display of VODs'},
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: '/favicon.ico' },
      { property: 'og:title', content: 'VODs' },
      { property: 'og:description', content: 'Temporary display of VODs' },
    ]
  })
  const hovered = ref(null)
  const page = usePage()
  async function loadData(page){
    return await useAsyncGql('GetVods', { limit: 12, page: page})
  }
  const { data } = await loadData(page.value)

  async function loadPage(newPage){
    if(newPage >= 1 && newPage <= data.value.vodsQuery.pages){
      page.value = newPage
      const { data:nextData } = await loadData(newPage)
      data.value = nextData.value
    }
  }
  function toHMS(sec){
      return new Date(sec * 1000).toISOString().substring(11, 19)
  }
  function toDate(id){
    return `${id.substring(0,4)}/${id.substring(4,6)}/${id.substring(6,8)}`
  }
  onMounted(async()=>{
  })
</script>
  <style>
  html, body {
    font-family:Roboto, Arial, sans-serif;
    background-color: #0e0e0e;
    overflow-x: hidden;
  }
  </style>