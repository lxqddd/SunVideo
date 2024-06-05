<script setup lang="ts">
import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.min.css'
import { onMounted, onUnmounted, ref } from 'vue'

const videoPlayer = ref<HTMLVideoElement>()
const player = ref<Player>()

onMounted(() => {
  player.value = videojs(videoPlayer.value!, {
    playbackRates: [0.5, 1, 1.5, 2],
    techOrder: ['html5'],
  }, () => {
    console.log('on player ready')
  })
})

const mediaSource = ref<MediaSource>(new MediaSource())
const sourceBuffer = ref<SourceBuffer>()
const videoSrc = ref(URL.createObjectURL(mediaSource.value))

mediaSource.value.addEventListener('sourceopen', () => {
  window.ipcRenderer.on('video-stream-chunk', (event, chunk) => {
    sourceBuffer.value!.appendBuffer(chunk)
  })

  window.ipcRenderer.on('video-stream-end', () => {
    mediaSource.value.endOfStream()
  })

  window.ipcRenderer.on('video-stream-error', (event, error) => {
    console.error('Error streaming video:', error)
  })
})

async function handleSelect() {
  const res = await window.ipcRenderer.invoke('select:video')
  sourceBuffer.value = mediaSource.value.addSourceBuffer(res[0].type)
  window.ipcRenderer.send('request:videoStream', res[0].path)
  console.log(res)
}

onUnmounted(() => {
  player.value?.dispose()
})
</script>

<template>
  <div class="h-100vh flex flex-col">
    <div class="title-bar flex items-center justify-center h-8 bg-sky">
      SunVideo
    </div>
    <div class="flex flex-1">
      <div class="flex items-center flex-1">
        <video
          ref="videoPlayer"
          class="video-js vjs-default-skin w-100% h-100%"
          controls
          preload="auto"
          :data-setup="{
          }"
        >
          <source :src="videoSrc" type="video/mp4">
        </video>
      </div>
      <div class="w-60 bg-blue h-100%">
        this is menu
        <el-button type="primary" @click="handleSelect">
          选择
        </el-button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title-bar {
  -webkit-app-region: drag;
  cursor: pointer;
}
</style>
