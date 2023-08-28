<template>
  <q-card :flat="!hover" bordered @mouseover="hover = true" @mouseout="hover = false">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">

            <q-btn no-caps :to="{ name: 'collection', params: { db: $route.params.db, name: collection.name } }" flat
              color="primary">
              {{ collection.name }}
            </q-btn>
          </div>
        </div>

        <div class="col-auto">
          <col-actions :collection="collection" @update="$emit('update')"></col-actions>
        </div>

      </div>
    </q-card-section>

    <q-card-section>
      <q-list>
        <q-item>
          <q-item-section avatar>
            <q-avatar class="bg-grey-3 " icon="mdi-code-json"></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Documents
            </q-item-label>
            <q-item-label caption>
              {{ collection.documents }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-avatar class="bg-grey-3 " icon="mdi-scale-balance"></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              Index
            </q-item-label>
            <q-item-label caption>
              {{ collection.indexes }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref } from "vue"
import ColActions from "./ColActions.vue";

const props = defineProps({
  collection: {
    type: Object
  }
})
const emit = defineEmits(['update'])

const hover = ref(false)


</script>

<style></style>
