<template>
    <div v-if="data.vod !== null">
        <div class="sm:block md:flex lg:flex h-screen m-0">
        <video class="sm:w-full md:w-3/5 lg:w-2/3 h-80 m-0" id="vod" ref="vod" playsinline controls></video>
        <video class="sm:w-full md:w-2/5 lg:w-1/3 h-80 m-0" id="chat" ref="chat" playsinline controls></video>
    </div>
    </div>
    <div v-else-if="pending">
        Loading
    </div>
    <div v-else>
        No VOD found for {{ id }}
    </div>
</template>

<script setup>
    const { id } = useRoute().params
    const { data, error, pending } = await useAsyncGql('simpleVOD', {id: id})
    let vodOptions = ref()
    let vodSources = ref()
    let chatOptions = ref()
    let chatSources = ref()
    if(data.value.vod !== null){
        vodOptions = {
        controls: ["rewind", "play-large", "play", "fast-forward", "progress", "current-time","duration", "mute", "volume", "settings", "download", "pip", "airplay", "fullscreen" ],
        settings: ["captions", "quality", "speed", "loop"],
        autoplay: false,
        volume: 0.5,
        keyboard: { focused: true, global: true },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        displayDuration: true,
        disableContextMenu: true,
        toggleInvert: true,
        fullscreen: { enabled: true, fallback: true, iosNative: false, container: null },
        ratio: '16:9',
        storage: { enabled: true, key: id },
        urls: { download: data.value.vod.download},
        markers: {},
    };
    vodSources = {
        type: "video",
        title: data.value.vod.title,
        sources: [{
            src: data.value.vod.vodURL,
            type: "video/mp4",
            size: 1080
        }],
        poster: data.value.vod.thumbnailURL,
    };
    chatOptions = {
        controls: ["current-time","duration","download"],
        settings: [],
        autoplay: false,
        volume: 0,
        keyboard: { focused: true, global: false },
        speed: { selected: 1, options: [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] },
        displayDuration: true,
        disableContextMenu: true,
        toggleInvert: true,
        fullscreen: { enabled: false, fallback: false, iosNative: false, container: null },
        ratio: '9:16',
        urls: { download: data.value.vod.chat.download},
        clickToPlay: false,
    };
    chatSources = {
        type: "video",
        title: data.value.vod.title,
        sources: [{
            src: data.value.vod.chat.chatUrl,
            type: "video/mp4",
            size: 1080
        }],
        poster: '',
    };
    }
    onMounted(async () => {
        if(data.value.vod !== null){
            const Plyr = await import("plyr");
            const vodPlayer = new Plyr.default("#vod", vodOptions);
            vodPlayer.source = vodSources;
    
            const chatPlayer = new Plyr.default("#chat", chatOptions);
            chatPlayer.source = chatSources;
    
            vodPlayer.on('playing', ()=>{
                chatPlayer.play()
            });
    
            vodPlayer.on('pause',()=>{
                chatPlayer.pause()
            });
    
            vodPlayer.on('seeked', ()=>{
                chatPlayer.currentTime = vodPlayer.currentTime
            })
    
            vodPlayer.on('enterfullscreen', ()=>{
                chatPlayer.pause()
            })
            vodPlayer.on('exitfullscreen',()=>{
                chatPlayer.play()
                chatPlayer.currentTime = vodPlayer.currentTime
            })
        }
    });
</script>

<style>
    @import 'plyr/dist/plyr.css';
    :root {
        --plyr-color-main: #9D00FF;
    }
    body{
        background-color: #0e0e0e;
        color: white;
    }
</style>