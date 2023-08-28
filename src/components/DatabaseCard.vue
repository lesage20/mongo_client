<template>
  <q-card :flat="!hover" bordered @mouseover="hover = true" @mouseout="hover = false">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">

            <q-btn no-caps :to="{ name: 'collections', params: { db: db.name } }" flat color="primary">
              {{ db.name }}
            </q-btn>
          </div>
        </div>

        <div class="col-auto">
          <database-actions :db="db" @update="$emit('update')"></database-actions>
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
              {{ db.collections?.length }}
            </q-item-label>
            <q-item-label caption>
              Collections
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar class="bg-grey-3 " icon="mdi-scale-balance"></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ get_size(db.sizeOnDisk) }}
            </q-item-label>
            <q-item-label caption>
              Taille (Mo)
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar>
            <q-avatar class="bg-grey-3 " icon="mdi-battery-outline"></q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>
              {{ db.empty ? "Oui" : "Non" }}
            </q-item-label>
            <q-item-label caption>
              Vide
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { ref } from "vue"
import DatabaseActions from "./DatabaseActions.vue";

const props = defineProps({
  db: {
    type: Object
  }
})
const emit = defineEmits(['update'])

const hover = ref(false)
function get_size(size) {
  if (size < 1024) {
    return `${Math.round(size)} octets`
  }
  else if (size < (1024 * 1024)) {
    return `${Math.round(size / 1024)} KB`
  }
  else if (size < (1024 * 1024 * 1024)) {
    return `${Math.round(size / (1024 * 1024))} MB`
  }
  else {
    return `${Math.round(size / (1024 * 1024 * 1024))} GB`
  }
}

</script>

<style></style>
