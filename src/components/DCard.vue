<template>
  <q-card flat bordered class="bg-grey-1">
    <q-card-section class="q-my-none q-py-none" v-for="(val, key) in document" :key="key">
      <tree-view class="q-my-none" :cle="key" :val="val"></tree-view>
    </q-card-section>
  </q-card>
</template>
<script setup>
import TreeView from './TreeView.vue';
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})
</script>
