<template>
  <div class="tree w-100% p-4 box-border">
    <div
      v-for="item in props.data"
      :key="item.name"
      class="cursor-pointer"
    >
      {{ item.name }}
      <div
        v-for="child in item.children"
        :key="child.name"
        class="cursor-pointer pl-3 line-height-5"
      >{{ child.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { ISourceTree } from '../../types/index'

const props = withDefaults(defineProps<{
  data: ISourceTree[]
}>(), {})

console.log(props)
</script>