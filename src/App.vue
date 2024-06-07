<script setup lang="ts">
import { VideoPlayer } from '@videojs-player/vue'
import 'video.js/dist/video-js.css'
import '@videojs/themes/dist/forest/index.css'
import { onMounted, onUnmounted, ref } from 'vue'
import type { ISourceTree } from './types'

const defaultProps = {
  label: 'name',
  children: 'children',
}

const videoPlayer = ref<HTMLVideoElement>()
// const player = ref<Player>()
const currentVideo = ref<{
  src: string
  type: string
}>()
const videoList = ref<ISourceTree[]>([
  {
    name: '',
    children: [
      {
        path: '',
        type: '',
        name: '',
        dir: '',
      },
    ],
  },
])

onMounted(() => {
  
})

async function handleSelect() {
  const res = await window.ipcRenderer.invoke('select:video')
  videoList.value = res
  
  console.log(res)
}

async function handleNodeClick(node) {
  if (node.children)
    return

  const ret = await window.ipcRenderer.invoke('video:url', node.dir, node.path)
  currentVideo.value = {
    type: node.type,
    src: ret
  }
  // if (player.value) {
  //   // player.value?.dispose()
  //   player.value = undefined
  // }
  // player.value = videojs(videoPlayer.value!, {
  //   playbackRates: [0.5, 1, 1.5, 2],
  //   techOrder: ['html5'],
  //   sources: [currentVideo.value]
  // }, () => {
  //   console.log('on player ready')
  // })
  console.log(currentVideo.value)
}

onUnmounted(() => {
  // player.value?.dispose()
})
</script>

<template>
  <div class="h-100vh flex flex-col">
    <div class="title-bar flex items-center justify-center h-8 bg-[skyblue]">
      SunVideo
    </div>
    <div class="flex flex-1">
      <div class="flex items-center justify-center flex-1">
        <video-player
          v-if="videoList.length"
          class="video-js vjs-theme-forest w-100% h-100%"
          controls
          crossorigin="anonymous"
          preload="auto"
          :sources="[currentVideo]"
          :data-setup="{
          }"
        >
          <!-- <source :src="currentVideoUrl" type="video/mp4"> -->
        </video-player>
        <div v-else>
          暂无可播放资源
        </div>
      </div>
      <div class="w-60 h-100%">
        <div class="flex flex-col items-center justify-center h-100% border-l-solid border-l-0.25 border-l-#fff">
          <div>
            <el-button type="primary" @click="handleSelect">
              选择文件
            </el-button>
            <el-button type="primary" @click="handleSelect">
              选择目录
            </el-button>
          </div>
          <el-tree
            class="flex-1 w-100%"
            :data="videoList"
            :props="defaultProps"
            @node-click="handleNodeClick"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title-bar {
  -webkit-app-region: drag;
}
</style>
