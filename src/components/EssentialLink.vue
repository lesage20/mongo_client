<template>
  <q-expansion-item dense :to="{ name: 'collections', params: { db: name } }" expand-icon-toggle expand-separator
    v-model="expanded" :label="name" :caption="caption" exact switch-toggle-side
    :header-class="$route.params.db == name ? 'text-blue-8 bg-blue-1' : 'text-grey-8 '">

    <q-card>
      <q-card-section class="q-py-xs">

        <q-item dense v-for="child in collections" :key="child.name" clickable
          :to="{ name: 'collection', params: { db: name, name: child.name } }"
          :class="$route.params.name == child.name ? 'text-blue-8 bg-blue-1' : 'text-grey-8 '">
          <q-item-section v-if="child.icon" avatar>
            <q-icon size="xs" name="mdi-folder" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ child.name }}</q-item-label>
            <q-item-label caption>{{ child.caption }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-card-section>

    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { ref } from 'vue'
const expanded = ref(false)

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  collections: {
    type: Array,
    default: () => ([])
  },
  caption: {
    type: String,
    default: ''
  },

  link: {
    type: String,
    default: '#'
  },

  icon: {
    type: String,
    default: ''
  }
})

</script>
