<template>
  <form class="pt-5 pl-10 pr-10" @submit.prevent>   
    <label for="default-search" class="mb-2 text-sm font-medium text-gray-700 sr-only dark:text-white">Search</label>
    <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg aria-hidden="true" class="w-5 h-5 text-gray-500 dark:text-gray-100" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <input type="text" v-model="text" id="default-search" class="block w-full p-4 pl-10 text-sm text-gray-900 border  rounded-lg bg-gray-50 focus:ring-slate-900  dark:bg-slate-900 dark:border-gray-900 dark:placeholder-gray-400 dark:text-white " placeholder="Search for VOD title or date eg: yyyymmdd" required>
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <p>{{ data.count }} / {{ data.total }}</p>
        </div>
      </div>
</form>
  <div v-if="data.vods.length">
    <div class="flex">
      <div class="flex-none w-10"></div>
      
        <div class="flex-1  grid grid-cols-1  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4  mt-5 space-x-2">
          <div v-for="vod in data.vods">
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
            <button :disabled="data.page === 1" @click="loadPage(data.page-1)" class="w-[100px] h-12 md:w-24 md:h-8 lg:w-24 lg:h-8 absolute left-0 drop-shadow-2xl rounded-full bg-purple-900 hover:bg-purple-800 hover:scale-110 active:bg-purple-700">Previous</button>
            <div class="flex text-center text-white w-full text-lg items-center justify-center space-x-5">
              <p>Page: {{ data.page }} / {{ data.pages }}</p>
              <a class="w-10 hidden sm:hidden md:flex lg:flex" href="https://github.com/piero0920/vods-app" target="_blank"><img src="/GitHub.png" alt="Github"></a>
            </div>
            <button :disabled="data.page === data.pages" @click="loadPage(data.page+1)" class="w-[100px] h-12 md:w-24 md:h-8 lg:w-24 lg:h-8 absolute right-0 drop-shadow-2xl rounded-full bg-purple-900 hover:bg-purple-800 hover:scale-110 active:bg-purple-700">Next</button>
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
  const text = ref('')
  const hovered = ref(null)
  const isSearch = ref(false)
  const textSearched = ref('')
  const page = usePage()
  async function loadData(page){
    if(isSearch.value === true){
      const {data:searhed } =  await useAsyncGql('searchVODs', { title:  textSearched.value, limit: 12, page: page})
      return searhed.value.searchVODs
    }else{
      const {data:vods } =  await useAsyncGql('GetVods', { limit: 12, page: page})
      return vods.value.vodsQuery
    }
  }
  const data = ref(await loadData(page.value))

  async function loadPage(newPage){
    if(newPage >= 1 && newPage <= data.value.pages){
      page.value = newPage
      const newData = await loadData(newPage)
      data.value = newData
    }
  }
  function toHMS(sec){
      return new Date(sec * 1000).toISOString().substring(11, 19)
  }
  function toDate(id){
    return `${id.substring(0,4)}/${id.substring(4,6)}/${id.substring(6,8)}`
  }

  watch(text, async(newText)=>{
    if(newText.length > 2){
      isSearch.value = true
      textSearched.value = newText
      const searchData = await loadData(1)
      data.value = searchData
    }else if(newText.length == 0){
      isSearch.value = false
      const newData0 = await loadData(page.value)
      data.value = newData0
    }
  })
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