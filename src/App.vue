<template>
  <div class="h-100vh flex flex-col">
    <div class="title-bar flex items-center justify-center h-8 bg-[skyblue]">
      SunVideo
    </div>
    <div class="flex flex-1">
      <div class="flex items-center justify-center flex-1">
        <video
          v-if="videoList.length"
          ref="videoPlayer"
          class="video-js vjs-default-skin w-100% h-100%"
          controls
          preload="auto"
          :data-setup="{
          }"
        >
          <source :src="''" type="video/mp4">
        </video>
        <div v-else>暂无可播放资源</div>
      </div>
      <div class="w-60 h-100%">
        <div class="flex flex-col items-center justify-center h-100% border-l-solid border-l-0.25 border-l-#fff">
          <div>
            <el-button type="primary" @click="handleSelect">选择文件</el-button>
            <el-button type="primary" @click="handleSelect">选择目录</el-button>
          </div>
          <el-tree
            class="flex-1 w-100%"
            :data="videoList"
            node-key="name"
            :props="{
              label: 'name'
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import videojs from 'video.js'
import type Player from 'video.js/dist/types/player'
import 'video.js/dist/video-js.min.css'
import { onMounted, onUnmounted, ref } from 'vue'
import { ISourceTree } from './types'

const videoPlayer = ref<HTMLVideoElement>()
const player = ref<Player>()
const videoList = ref<ISourceTree[]>([])

onMounted(() => {
  player.value = videojs(videoPlayer.value!, {
    playbackRates: [0.5, 1, 1.5, 2],
    techOrder: ['html5'],
  }, () => {
    console.log('on player ready')
  })
})


async function handleSelect() {
  const res = await window.ipcRenderer.invoke('select:video')
  videoList.value = res
  console.log(res)
}

onUnmounted(() => {
  player.value?.dispose()
})
</script>

<style lang="scss" scoped>
.title-bar {
  -webkit-app-region: drag;
}
</style>
